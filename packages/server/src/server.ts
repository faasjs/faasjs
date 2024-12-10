import { randomBytes } from 'node:crypto'
import { existsSync } from 'node:fs'
import {
  type Server as HttpServer,
  type IncomingMessage,
  type ServerResponse,
  createServer,
} from 'node:http'
import type { Socket } from 'node:net'
import { join, resolve as pathResolve, sep } from 'node:path'
import { Readable } from 'node:stream'
import { createBrotliCompress, createDeflate, createGzip } from 'node:zlib'
import type { Func } from '@faasjs/func'
import { HttpError } from '@faasjs/http'
import { loadConfig } from '@faasjs/load'
import { Logger } from '@faasjs/logger'

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

const AdditionalHeaders = [
  'content-type',
  'authorization',
  'x-faasjs-request-id',
  'x-faasjs-timing-pending',
  'x-faasjs-timing-processing',
  'x-faasjs-timing-total',
]

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
  public readonly runtime: 'esm' | 'cjs' | 'bun'
  public readonly onError: (error: any) => void
  protected closed = false

  private processing = false
  private activeRequests = 0
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

    this.logger = new Logger(`server][${randomBytes(16).toString('hex')}`)
    this.logger.debug(
      'FaasJS server initialized: [%s] [%s] %s %j',
      process.env.FaasEnv,
      process.env.FaasMode,
      this.root,
      this.opts
    )

    this.onError = (error: any) => {
      if (!(error instanceof Error)) error = Error(error)

      this.logger.error(error)
      opts.onError?.(error)
    }

    if ((globalThis as any).Bun) {
      this.runtime = 'bun'
    } else {
      if (typeof globalThis.require === 'function') {
        this.runtime = 'cjs'
      } else {
        this.runtime = 'esm'
      }
    }

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
          'Access-Control-Expose-Headers': (
            req.headers['access-control-expose-headers'] || ''
          )
            .split(',')
            .filter(Boolean)
            .concat(AdditionalHeaders)
            .join(','),
          'X-FaasJS-Request-Id': requestId,
          'X-FaasJS-Timing-Pending': (startedAt - requestedAt).toString(),
        }

        // get and remove accept-encoding to avoid http module compression
        const encoding = req.headers['accept-encoding'] || ''
        delete req.headers['accept-encoding']

        let data: any
        try {
          let cache: Cache = {}

          if (this.opts.cache && this.cachedFuncs[path]?.handler) {
            cache = this.cachedFuncs[path]
            logger.debug('Response with cached %s', cache.file)
          } else {
            cache.file = pathResolve('.', this.getFilePath(path))
            logger.debug('Response with %s', cache.file)

            const func = await this.importFuncFile(cache.file)

            func.config = loadConfig(
              this.root,
              path,
              process.env.FaasEnv || 'development'
            )
            if (!func.config) throw Error('No config file found')

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
              raw: {
                request: req,
                response: res,
              },
            },
            { request_id: requestId }
          )
        } catch (error: any) {
          logger.error(error)
          data = error
        }

        if (res.writableEnded) return resolve()

        // process headers
        const finishedAt = Date.now()

        if (data.headers) headers = Object.assign(headers, data.headers)

        if (!headers['X-FaasJS-Timing-Processing'])
          headers['X-FaasJS-Timing-Processing'] = (
            finishedAt - startedAt
          ).toString()

        if (!headers['X-FaasJS-Timing-Total'])
          headers['X-FaasJS-Timing-Total'] = (
            finishedAt - requestedAt
          ).toString()

        Object.freeze(headers)

        for (const key in headers) res.setHeader(key, headers[key])

        if (data instanceof Response) {
          res.statusCode = data.status

          const reader = data.body.getReader()

          const stream = Readable.from(
            (async function* () {
              while (true) {
                try {
                  const { done, value } = await reader.read()
                  if (done) break
                  if (value) yield value
                } catch (error: any) {
                  logger.error(error)
                  stream.emit(error)
                  break
                }
              }
            })()
          )

          stream
            .pipe(res)
            .on('finish', () => {
              res.end()
              resolve()
            })
            .on('error', err => {
              this.onError(err)
              if (!res.headersSent) {
                res.statusCode = 500
                res.setHeader('Content-Type', 'application/json')
                res.write(JSON.stringify({ error: { message: err.message } }))
              }
              resolve()
            })

          return
        }

        let resBody: string | Buffer
        if (
          data instanceof Error ||
          data?.constructor?.name?.includes('Error') ||
          typeof data === 'undefined' ||
          data === null
        ) {
          res.statusCode = data?.statusCode || 500
          res.setHeader('Content-Type', 'application/json; charset=utf-8')
          resBody = JSON.stringify({
            error: { message: data?.message || 'No response' },
          })
        } else {
          if (data.statusCode) res.statusCode = data.statusCode

          if (data.body)
            if (data.isBase64Encoded) resBody = Buffer.from(data.body, 'base64')
            else resBody = data.body
        }

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
              .on('error', (err: any) => {
                if (err) logger.error(err)

                res.end()
                resolve()
              })
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
      '[%s] Listen http://localhost:%s with %s %s',
      process.env.FaasEnv,
      this.opts.port,
      this.root,
      this.runtime
    )

    const mounted: Record<string, Mounted> = {}

    this.server = createServer(async (req, res) => {
      this.activeRequests++

      res.on('finish', () => this.activeRequests--)

      // don't lock options request
      if (req.method === 'OPTIONS') {
        res.writeHead(204, {
          'Access-Control-Allow-Origin': req.headers.origin || '*',
          'Access-Control-Allow-Credentials': 'true',
          'Access-Control-Allow-Methods': 'OPTIONS, POST',
          'Access-Control-Allow-Headers': Object.keys(req.headers)
            .concat(req.headers['access-control-request-headers'] || [])
            .filter(
              key =>
                !key.startsWith('access-control-') &&
                !['host', 'connection'].includes(key) &&
                !AdditionalHeaders.includes(key)
            )
            .concat(AdditionalHeaders)
            .join(', '),
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

        return
      }

      const now = Date.now()
      const timer = setInterval(async () => {
        if (!this.processing) {
          this.processing = true
          clearInterval(timer)
          await this.processRequest(path, req, res, now)
          this.processing = false
        }
      })
    })
      .on('connection', socket => {
        this.sockets.add(socket)
        socket.on('close', () => {
          this.sockets.delete(socket)
        })
      })
      .on('error', this.onError)
      .listen(this.opts.port, '0.0.0.0')

    process
      .on('uncaughtException', e => {
        this.logger.debug('Uncaught exception')
        this.onError(e)
      })
      .on('unhandledRejection', e => {
        this.logger.debug('Unhandled rejection')
        this.onError(e)
      })
      .on('SIGTERM', async () => {
        this.logger.debug('received SIGTERM')

        if (this.closed) {
          this.logger.debug('already closed')
          return
        }

        await this.close()

        if (!process.env.JEST_WORKER_ID) process.exit(0)
      })
      .on('SIGINT', async () => {
        this.logger.debug('received SIGINT')

        if (this.closed) {
          this.logger.debug('already closed')
          return
        }

        await this.close()

        if (!process.env.JEST_WORKER_ID) process.exit(0)
      })

    return this.server
  }

  public async close(): Promise<void> {
    if (this.closed) {
      this.logger.debug('already closed')
      return
    }

    this.logger.debug('closing')
    this.logger.time(`${this.logger.label}close`)

    if (this.activeRequests) {
      await new Promise<void>(resolve => {
        const check = () => {
          if (this.activeRequests === 0) {
            resolve()
            return
          }

          this.logger.debug('waiting for %i requests', this.activeRequests)

          setTimeout(check, 50)
        }
        check()
      })
    }

    for (const socket of this.sockets)
      try {
        socket.destroy()
      } catch (error: any) {
        this.onError(error)
      } finally {
        this.sockets.delete(socket)
      }

    await new Promise<void>(resolve => {
      this.server.close(err => {
        if (err) this.onError(err)
        resolve()
      })
    })

    this.logger.timeEnd(`${this.logger.label}close`, 'closed')
    this.closed = true
  }

  private getFilePath(path: string) {
    // Safe check
    if (/^(\.|\|\/)+$/.test(path)) throw Error('Illegal characters')

    const deeps = path.replace(this.root, '').split('/').length
    const parents = path.replace(this.root, '').split('/').filter(Boolean)
    const searchPaths = [
      `${path}.func.ts`,
      `${path}.func.tsx`,
      `${path}/index.func.ts`,
      `${path}/index.func.tsx`,
    ].concat(
      ...Array(deeps)
        .fill(0)
        .flatMap((_, i) => {
          const folder = this.root + parents.slice(0, -(i + 1)).join('/')

          return [
            join(folder, 'default.func.ts'),
            join(folder, 'default.func.tsx'),
          ]
        })
    )

    for (const path of searchPaths) {
      if (existsSync(path)) return path
    }

    const message =
      process.env.FaasEnv === 'production'
        ? 'Not found.'
        : `Not found function file.\nSearch paths:\n${searchPaths
            .map(p => `- ${p}`)
            .join('\n')}`
    this.onError(message)
    throw new HttpError({
      statusCode: 404,
      message,
    })
  }

  private async importFuncFile(path: string): Promise<Func> {
    switch (this.runtime) {
      case 'cjs': {
        return require(path).default as Func
      }
      default: {
        const func = (await import(path)).default

        return (func.default ? func.default : func) as Func
      }
    }
  }

  private clearCache() {
    this.logger.debug('Clear cache')

    for (const key of Object.keys(require.cache)) {
      if (!key.includes('node_modules') || key.includes('faasjs'))
        delete require.cache[key]
    }
  }
}
