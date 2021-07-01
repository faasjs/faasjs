/* eslint-disable @typescript-eslint/no-var-requires,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call */
import { createServer, IncomingMessage, Server as HttpServer } from 'http'
import Logger from '@faasjs/logger'
import { existsSync } from 'fs'
import { loadConfig } from '@faasjs/load'
import { resolve as pathResolve, sep, join } from 'path'
import { HttpError } from '@faasjs/http'
import { Socket } from 'net'

interface Cache {
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
 * 本地服务端
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
  }

  private server: HttpServer
  private sockets: Set<Socket>

  /**
   * 创建本地服务器
   * @param root {string} 云函数的根目录
   * @param opts {object} 配置项
   * @param cache {boolean} 是否缓存云函数，默认为 false，每次接收请求都会重新编译和加载云函数代码
   * @param port {number} 端口号，默认为 3000
   */
  constructor (root: string, opts?: {
    cache?: boolean
    port?: number
  }) {
    this.root = root.endsWith(sep) ? root : root + sep
    this.logger = new Logger('FaasJS')
    this.opts = Object.assign({
      cache: false,
      port: 3000
    }, (opts) || {})
    this.cachedFuncs = {}
    this.logger.debug('Init with %s %o', this.root, this.opts)
    this.sockets = new Set()
    servers.push(this)
  }

  public async processRequest (req: IncomingMessage, res: {
    statusCode: number
    write: (body: string | Buffer) => void
    end: () => void
    setHeader: (key: string, value: string) => void
  }): Promise<void> {
    this.logger.info('[Request] %s', req.url)

    return await new Promise((resolve) => {
      const requestId = new Date().getTime().toString()
      let body = ''

      req.on('readable', function () {
        body += req.read() || ''
      })

      req.on('end', async () => {
        let data
        try {
          // 提取 path
          const path = join(this.root, req.url!).replace(/\?.*/, '')

          let cache: Cache = {}

          if (this.opts.cache && this.cachedFuncs[path] && (this.cachedFuncs[path].handler)) {
            this.logger.info('[Response] cached: %s', cache.file)
            cache = this.cachedFuncs[path]
          } else {
            cache.file = pathResolve('.', this.getFilePath(path))
            this.logger.info('[Response] %s', cache.file)

            const func = require(cache.file).default
            func.config = loadConfig(this.root, path)[process.env.FaasEnv || 'development']
            cache.handler = func.export().handler

            if (this.opts.cache) this.cachedFuncs[path] = cache
            else this.clearCache()
          }

          data = await cache.handler!({
            headers: req.headers,
            httpMethod: req.method,
            path: req.url,
            body,
            requestContext: {
              httpMethod: req.method,
              identity: {},
              path: req.url,
              sourceIp: req.socket?.remoteAddress
            }
          }, { request_id: requestId })
        } catch (error) {
          data = error
        }

        if (data instanceof Error || (data?.constructor?.name?.includes('Error')) || typeof data === 'undefined' || data === null) {
          res.statusCode = data?.statusCode || 500
          res.setHeader('Content-Type', 'application/json; charset=utf-8')
          res.setHeader('X-SCF-RequestId', requestId)
          res.write(JSON.stringify({ error: { message: data?.message || 'No response' } }))
        } else {
          if (data.statusCode) res.statusCode = data.statusCode

          if (data.headers)
            for (const key in data.headers)
              if (Object.prototype.hasOwnProperty.call(data.headers, key)) res.setHeader(key, data.headers[key])



          if (data.body)
            if (data.isBase64Encoded) res.write(Buffer.from(data.body, 'base64')); else res.write(data.body)
        }
        res.end()
        resolve()
      })
    })
  }

  public listen (): HttpServer {
    if (!process.env.FaasEnv && process.env.NODE_ENV === 'development') process.env.FaasEnv = 'development'

    process.env.FaasMode = 'local'
    process.env.FaasLocal = `http://localhost:${this.opts.port}`

    if (this.server) throw Error('Server already running')

    this.logger.info('[%s] Listen http://localhost:%s with %s', process.env.FaasEnv, this.opts.port, this.root)

    this.server = createServer(this.opts.cache
      ? this.processRequest.bind(this)
      : async (req, res) => {
        if (!this.processing) {
          this.processing = true
          await this.processRequest(req, res)
          this.processing = false
        } else {
          const timer = setInterval(async () => {
            if (!this.processing) {
              this.processing = true
              clearInterval(timer)
              await this.processRequest(req, res)
              this.processing = false
            }
          })
        }
      })
      .on('connection', (socket) => {
        this.sockets.add(socket)
        socket.on('close', () => {
          this.sockets.delete(socket)
        })
      })
      .listen(this.opts.port, '0.0.0.0')

    return this.server
  }

  public async close (): Promise<void> {
    this.logger.debug('Close server')
    console.log(this.sockets)

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

    if (existsSync(path + '.func.ts')) return path + '.func.ts'; else if (existsSync(path + '/index.func.ts')) return path + '/index.func.ts'

    throw new HttpError({
      statusCode: 404,
      message: `Not found: ${path}.func.ts or ${path}index.func.ts`
    })
  }

  private clearCache () {
    this.logger.debug('Clear cache')
    Object.keys(require.cache).forEach(function (id) {
      if (!id.includes('node_modules') || id.includes('faasjs')) delete require.cache[id]
    })
  }
}
