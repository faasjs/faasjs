import {
  createServer, IncomingMessage, Server as HttpServer
} from 'http'
import { Logger } from '@faasjs/logger'
import { existsSync } from 'fs'
import { loadConfig } from '@faasjs/load'
import {
  resolve as pathResolve, sep, join
} from 'path'
import { HttpError } from '@faasjs/http'
import { Socket } from 'net'
import { addHook } from 'pirates'
import { transform } from '@faasjs/ts-transform'
import { randomBytes } from 'crypto'

addHook((code, filename) => {
  if (filename.endsWith('.d.ts'))
    return ''

  return transform(code, { filename }).code
}, {
  exts: [
    '.jsx',
    '.ts',
    '.tsx'
  ]
})

type Cache = {
  file?: string
  handler?: (...args: any) => Promise<any>
}

const servers: Server[] = []

export function getAll (): Server[] {
  return servers
}

export async function closeAll (): Promise<void> {
  for (const server of servers)
    await server.close()
}

/**
 * FaasJS Server.
 *
 * ```ts
 * const server = new Server(process.cwd(), {
 *  port: 8080,
 *  cache: false,
 * })
 *
 * server.listen()
 * ```
 */
export class Server {
  public readonly root: string
  public readonly logger: Logger
  public readonly opts: {
    cache: boolean
    port: number
  }

  private processing = false
  private cachedFuncs: {
    [path: string]: Cache
  } = {}

  private server: HttpServer
  private sockets: Set<Socket> = new Set()

  /**
   * @param root Project path
   * @param opts Options
   * @param opts.cache Enable cache, default is false
   * @param opts.port Port, default is 3000
   */
  constructor (root: string, opts?: {
    cache?: boolean
    port?: number
  }) {
    if (!process.env.FaasEnv && process.env.NODE_ENV === 'development')
      process.env.FaasEnv = 'development'

    this.root = root.endsWith(sep) ? root : root + sep
    this.opts = Object.assign({
      cache: false,
      port: 3000
    }, (opts) || {})

    process.env.FaasMode = this.opts.cache ? 'mono' : 'local'
    process.env.FaasLocal = `http://localhost:${this.opts.port}`

    this.logger = new Logger('FaasJS')
    this.logger.debug('Init with %s %j', this.root, this.opts)

    servers.push(this)
  }

  public async processRequest (req: IncomingMessage, res: {
    statusCode: number
    write: (body: string | Buffer) => void
    end: () => void
    setHeader: (key: string, value: string) => void
  }): Promise<void> {
    this.logger.info('Process %s %s', req.method, req.url)

    return await new Promise((resolve) => {
      const requestId = randomBytes(16).toString('hex')
      let body = ''

      req.on('readable', function () {
        body += req.read() || ''
      })

      req.on('end', async () => {
        let headers: {
          [key: string]: string
        } = {
          'Access-Control-Allow-Origin': req.headers.origin || '*',
          'Access-Control-Allow-Credentials': 'true',
          'Access-Control-Allow-Methods': 'OPTIONS, POST',
          'X-FaasJS-Request-Id': requestId
        }

        if (req.method === 'OPTIONS') {
          headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
          for (const key in headers)
            res.setHeader(key, headers[key])
          res.statusCode = 204
          res.end()
          resolve()
          return
        }

        let data
        try {
          // 提取 path
          const path = join(this.root, req.url).replace(/\?.*/, '')

          let cache: Cache = {}

          if (this.opts.cache && this.cachedFuncs[path] && (this.cachedFuncs[path].handler)) {
            cache = this.cachedFuncs[path]
            this.logger.debug('[%s] Response with cached %s', requestId, cache.file)
          } else {
            cache.file = pathResolve('.', this.getFilePath(path))
            this.logger.debug('[%s] Response with %s', requestId, cache.file)

            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const func = require(cache.file).default
            func.config = loadConfig(this.root, path)[process.env.FaasEnv || 'development']
            cache.handler = func.export().handler

            if (this.opts.cache)
              this.cachedFuncs[path] = cache
            else
              this.clearCache()
          }

          const url = new URL(req.url, `http://${req.headers.host}`)

          data = await cache.handler({
            headers: req.headers,
            httpMethod: req.method,
            path: url.pathname,
            queryString: Object.fromEntries(new URLSearchParams(url.search)),
            body,
          }, { request_id: requestId })
        } catch (error) {
          data = error
        }

        let resBody
        if (data instanceof Error || (data?.constructor?.name?.includes('Error')) || typeof data === 'undefined' || data === null) {
          res.statusCode = data?.statusCode || 500
          headers['Content-Type'] = 'application/json; charset=utf-8'
          resBody = JSON.stringify({ error: { message: data?.message || 'No response' } })
        } else {
          if (data.statusCode)
            res.statusCode = data.statusCode

          if (data.headers)
            headers = Object.assign(headers, data.headers)

          if (data.body)
            if (data.isBase64Encoded)
              resBody = Buffer.from(data.body, 'base64')
            else
              resBody = data.body
        }

        for (const key in headers)
          res.setHeader(key, headers[key])

        if (resBody) {
          this.logger.debug('[%s] Response %s %j', requestId, res.statusCode, headers)
          res.write(resBody)
        }

        res.end()
        resolve()
      })
    })
  }

  /**
   * Start server.
   * @returns {Server}
   */
  public listen (): HttpServer {
    if (this.server) throw Error('Server already running')

    this.logger.info('[%s] Listen http://localhost:%s with %s', process.env.FaasEnv, this.opts.port, this.root)

    this.logger.label = null

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this

    this.server = createServer(this.opts.cache
      ? this.processRequest.bind(this)
      : async (req, res) => {
        // don't lock options request
        if (req.method === 'OPTIONS') {
          const headers: {
            [key: string]: string
          } = {
            'Access-Control-Allow-Origin': req.headers.origin || '*',
            'Access-Control-Allow-Credentials': 'true',
            'Access-Control-Allow-Methods': 'OPTIONS, POST',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          }

          for (const key in headers)
            res.setHeader(key, headers[key])

          res.statusCode = 204

          res.end()
          return
        }
        if (!self.processing) {
          self.processing = true
          await self.processRequest(req, res)
          self.processing = false
        } else {
          const timer = setInterval(async () => {
            if (!self.processing) {
              self.processing = true
              clearInterval(timer)
              await self.processRequest(req, res)
              self.processing = false
            }
          })
        }
      })
      .on('connection', (socket) => {
        self.sockets.add(socket)
        socket.on('close', () => {
          self.sockets.delete(socket)
        })
      })
      .listen(this.opts.port, '0.0.0.0')

    return this.server
  }

  public async close (): Promise<void> {
    this.logger.debug('Close server')

    for (const socket of this.sockets)
      try {
        socket.destroy()
      } catch (error) {
        console.error(error)
      } finally {
        this.sockets.delete(socket)
      }

    await new Promise<void>((resolve) => {
      this.server.close((err) => {
        if (err) console.error(err)
        else resolve()
      })
    })
  }

  private getFilePath (path: string) {
    // Safe check
    if (/^(\.|\|\/)+$/.test(path)) throw Error('Illegal characters')

    const parentPath = path.split('/').slice(0, -1).join('/')
    const searchPaths = [
      path + '.func.ts',
      path + '.func.tsx',
      path + '/index.func.ts',
      path + '/index.func.tsx',
      parentPath + '/default.func.ts',
      parentPath + '/default.func.tsx'
    ]

    for (const path of searchPaths) {
      if (existsSync(path))
        return path
    }

    const message = `Not found function file.\nSearch paths:\n${searchPaths.map(p => `- ${p}`).join('\n')}`
    this.logger.error(message)
    throw new HttpError({
      statusCode: 404,
      message
    })
  }

  private clearCache () {
    this.logger.debug('Clear cache')
    Object.keys(require.cache).forEach(function (id) {
      if (!id.includes('node_modules') || id.includes('faasjs'))
        delete require.cache[id]
    })
  }
}
