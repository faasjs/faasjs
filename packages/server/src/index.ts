import {
  createServer,
  IncomingMessage,
  Server as HttpServer,
  ServerResponse,
} from 'node:http'
import { Logger } from '@faasjs/logger'
import { existsSync } from 'node:fs'
import { loadConfig } from '@faasjs/load'
import { resolve as pathResolve, sep, join } from 'path'
import { HttpError } from '@faasjs/http'
import { Socket } from 'node:net'
import { addHook } from 'pirates'
import { transform } from '@faasjs/ts-transform'
import { randomBytes } from 'node:crypto'
import { Readable } from 'node:stream'
import { createBrotliCompress, createGzip, createDeflate } from 'node:zlib'

addHook(
  (code, filename) => {
    if (filename.endsWith('.d.ts')) return ''

    return transform(code, { filename }).code
  },
  {
    exts: ['.jsx', '.ts', '.tsx'],
  }
)

type Cache = {
  file?: string
  handler?: (...args: any) => Promise<any>
}

type Mounted = {
  pending: [IncomingMessage, ServerResponse<IncomingMessage>, number][]
}

const servers: Server[] = []

export function getAll(): Server[] {
  return servers
}

export async function closeAll(): Promise<void> {
  for (const server of servers) await server.close()
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
  public onError?: (error: Error) => void

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
  constructor(
    root: string,
    opts?: {
      cache?: boolean
      port?: number
      onError?: (error: Error) => void
    }
  ) {
    if (!process.env.FaasEnv && process.env.NODE_ENV === 'development')
      process.env.FaasEnv = 'development'

    this.root = root.endsWith(sep) ? root : root + sep
    this.opts = Object.assign(
      {
        cache: false,
        port: 3000,
      },
      opts || {}
    )

    if (!process.env.FaasMode)
      process.env.FaasMode = this.opts.cache ? 'mono' : 'local'

    process.env.FaasLocal = `http://localhost:${this.opts.port}`

    this.logger = new Logger('FaasJS')
    this.logger.debug(
      'Initialize [%s] [%s] %s %j',
      process.env.FaasEnv,
      process.env.FaasMode,
      this.root,
      this.opts
    )

    servers.push(this)
  }

  public async processRequest(
    path: string,
    req: IncomingMessage,
    res: ServerResponse & {
      statusCode: number
      write: (body: string | Buffer) => void
      end: () => void
      setHeader: (key: string, value: string) => void
    },
    requestedAt: number
  ): Promise<void> {
    const requestId =
      (req.headers['x-faasjs-request-id'] as string) ||
      (req.headers['x-request-id'] as string) ||
      `FS-${randomBytes(16).toString('hex')}`
    const logger = new Logger(requestId)

    logger.info('%s %s', req.method, req.url)

    const startedAt = Date.now()

    return await new Promise(resolve => {
      let body = ''

      req.on('readable', () => {
        body += req.read() || ''
      })

      req.on('end', async () => {
        let headers: {
          [key: string]: string
        } = {
          'Access-Control-Allow-Origin': req.headers.origin || '*',
          'Access-Control-Allow-Credentials': 'true',
          'Access-Control-Allow-Methods': 'OPTIONS, POST',
          'X-FaasJS-Request-Id': requestId,
          'X-FaasJS-Timing-Pending': (startedAt - requestedAt).toString(),
        }

        // get and remove accept-encoding to avoid http module compression
        const encoding = req.headers['accept-encoding'] || ''
        delete req.headers['accept-encoding']

        let data
        try {
          let cache: Cache = {}

          if (this.opts.cache && this.cachedFuncs[path]?.handler) {
            cache = this.cachedFuncs[path]
            logger.debug('Response with cached %s', cache.file)
          } else {
            cache.file = pathResolve('.', this.getFilePath(path))
            logger.debug('Response with %s', cache.file)

            const func = require(cache.file).default
            func.config = loadConfig(this.root, path)[
              process.env.FaasEnv || 'development'
            ]
            cache.handler = func.export().handler

            if (this.opts.cache) this.cachedFuncs[path] = cache
            else this.clearCache()
          }

          const url = new URL(req.url, `http://${req.headers.host}`)

          data = await cache.handler(
            {
              headers: req.headers,
              httpMethod: req.method,
              path: url.pathname,
              queryString: Object.fromEntries(new URLSearchParams(url.search)),
              body,
            },
            { request_id: requestId }
          )
        } catch (error) {
          data = error
        }

        let resBody: string | Buffer
        if (
          data instanceof Error ||
          data?.constructor?.name?.includes('Error') ||
          typeof data === 'undefined' ||
          data === null
        ) {
          res.statusCode = data?.statusCode || 500
          headers['Content-Type'] = 'application/json; charset=utf-8'
          resBody = JSON.stringify({
            error: { message: data?.message || 'No response' },
          })
        } else {
          if (data.statusCode) res.statusCode = data.statusCode

          if (data.headers) headers = Object.assign(headers, data.headers)

          if (data.body)
            if (data.isBase64Encoded) resBody = Buffer.from(data.body, 'base64')
            else resBody = data.body
        }

        const finishedAt = Date.now()
        res.setHeader(
          'X-FaasJS-Timing-Processing',
          (finishedAt - startedAt).toString()
        )
        res.setHeader(
          'X-FaasJS-Timing-Total',
          (finishedAt - requestedAt).toString()
        )

        for (const key in headers) res.setHeader(key, headers[key])

        if (resBody) {
          logger.debug('Response %s %j', res.statusCode, headers)

          if (
            res.statusCode !== 200 ||
            typeof resBody !== 'string' ||
            Buffer.byteLength(resBody) < 600
          ) {
            res.write(resBody)
            res.end()
            resolve()
            return
          }

          const onError = (err: any) => {
            if (err) console.error(err)

            res.end()
            resolve()
          }

          const compression = encoding.includes('br')
            ? {
                type: 'br',
                compress: createBrotliCompress(),
              }
            : encoding.includes('gzip')
              ? {
                  type: 'gzip',
                  compress: createGzip(),
                }
              : encoding.includes('deflate')
                ? {
                    type: 'deflate',
                    compress: createDeflate(),
                  }
                : false

          if (compression) {
            res.setHeader('Vary', 'Accept-Encoding')
            res.writeHead(200, { 'Content-Encoding': compression.type })

            Readable.from(resBody)
              .pipe(compression.compress)
              .pipe(res)
              .on('error', onError)
              .on('close', () => {
                res.end()
                resolve()
              })
            return
          }

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
  public listen(): HttpServer {
    if (this.server) throw Error('Server already running')

    this.logger.info(
      '[%s] Listen http://localhost:%s with %s',
      process.env.FaasEnv,
      this.opts.port,
      this.root
    )

    this.logger.label = null

    const mounted: Record<string, Mounted> = {}

    this.server = createServer(async (req, res) => {
      // don't lock options request
      if (req.method === 'OPTIONS') {
        res.writeHead(204, {
          'Access-Control-Allow-Origin': req.headers.origin || '*',
          'Access-Control-Allow-Credentials': 'true',
          'Access-Control-Allow-Methods': 'OPTIONS, POST',
          'Access-Control-Allow-Headers': [
            'Content-Type',
            'Authorization',
            'X-FaasJS-Request-Id',
            'X-FaasJS-Timing-Pending',
            'X-FaasJS-Timing-Processing',
            'X-FaasJS-Timing-Total',
          ].join(', '),
        })
        res.end()
        return
      }

      const path = join(this.root, req.url).replace(/\?.*/, '')

      if (this.opts.cache) {
        if (!mounted[path]) mounted[path] = { pending: [] } as Mounted

        mounted[path].pending.push([req, res, Date.now()])

        const pending = mounted[path].pending
        mounted[path].pending = []
        for (const event of pending)
          await this.processRequest(path, event[0], event[1], event[2])

        return
      }

      if (!this.processing) {
        this.processing = true
        await this.processRequest(path, req, res, Date.now())
        this.processing = false
      } else {
        const now = Date.now()
        const timer = setInterval(async () => {
          if (!this.processing) {
            this.processing = true
            clearInterval(timer)
            await this.processRequest(path, req, res, now)
            this.processing = false
          }
        })
      }
    })
      .on('connection', socket => {
        this.sockets.add(socket)
        socket.on('close', () => {
          this.sockets.delete(socket)
        })
      })
      .on('error', console.error)
      .listen(this.opts.port, '0.0.0.0')

    process.on('uncaughtException', error => this.onError?.(error))

    process.on('unhandledRejection', reason =>
      this.onError?.(Error(reason.toString()))
    )

    return this.server
  }

  public async close(): Promise<void> {
    this.logger.debug('Close server')

    for (const socket of this.sockets)
      try {
        socket.destroy()
      } catch (error) {
        console.error(error)
      } finally {
        this.sockets.delete(socket)
      }

    await new Promise<void>(resolve => {
      this.server.close(err => {
        if (err) console.error(err)
        else resolve()
      })
    })
  }

  private getFilePath(path: string) {
    // Safe check
    if (/^(\.|\|\/)+$/.test(path)) throw Error('Illegal characters')

    const parentPath = path.split('/').slice(0, -1).join('/')
    const searchPaths = [
      `${path}.func.ts`,
      `${path}.func.tsx`,
      `${path}/index.func.ts`,
      `${path}/index.func.tsx`,
      `${parentPath}/default.func.ts`,
      `${parentPath}/default.func.tsx`,
    ]

    for (const path of searchPaths) {
      if (existsSync(path)) return path
    }

    const message =
      process.env.FaasEnv === 'production'
        ? 'Not found.'
        : `Not found function file.\nSearch paths:\n${searchPaths
            .map(p => `- ${p}`)
            .join('\n')}`
    this.logger.error(message)
    throw new HttpError({
      statusCode: 404,
      message,
    })
  }

  private clearCache() {
    this.logger.debug('Clear cache')

    for (const key of Object.keys(require.cache)) {
      if (!key.includes('node_modules') || key.includes('faasjs'))
        delete require.cache[key]
    }
  }
}
