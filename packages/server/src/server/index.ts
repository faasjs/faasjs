import { execSync } from 'node:child_process'
import { randomBytes } from 'node:crypto'
import { existsSync } from 'node:fs'
import {
  createServer,
  type Server as HttpServer,
  type IncomingMessage,
  type ServerResponse,
} from 'node:http'
import type { Socket } from 'node:net'
import { join, resolve, sep } from 'node:path'
import { Readable } from 'node:stream'
import { types } from 'node:util'
import { createBrotliCompress, createDeflate, createGzip } from 'node:zlib'
import { deepMerge } from '@faasjs/deep_merge'
import type { Func } from '@faasjs/func'
import { HttpError } from '@faasjs/http'
import { loadConfig, loadPackage } from '@faasjs/load'
import { getTransport, Logger } from '@faasjs/logger'
import type { Middleware } from '../middleware'
import { buildCORSHeaders } from './headers'
import { getRouteFiles } from './routes'

export type ServerHandlerOptions = {
  requestedAt?: number
  filepath?: string
}

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
 * Options for configuring the server.
 */
/**
 * Configuration options for the server.
 */
export type ServerOptions = {
  /**
   * The port on which the server will listen. Defaults to `3000` if not provided.
   *
   * @default 3000
   */
  port?: number

  /**
   * Callback function that is invoked when the server starts.
   *
   * This function is executed asynchronously and will not interrupt the server
   * if an error occurs during its execution.
   *
   * @param context - An object containing the logger instance.
   *
   * @example
   * ```typescript
   * const server = new Server(process.cwd(), {
   *   onStart: async ({ logger }) => {
   *     logger.info('Server started');
   *   }
   * });
   * ```
   */
  onStart?: (context: { logger: Logger }) => Promise<void>

  /**
   * Callback function that is invoked when an error occurs.
   *
   * This function is executed asynchronously and allows handling of errors
   * that occur during server operation.
   *
   * @param error - The error that occurred.
   * @param context - An object containing the logger instance.
   *
   * @example
   * ```typescript
   * const server = new Server(process.cwd(), {
   *   onError: async (error, { logger }) => {
   *     logger.error(error);
   *   }
   * });
   * ```
   */
  onError?: (error: Error, context: { logger: Logger }) => Promise<void>

  /**
   * Callback function that is invoked when the server is closed.
   *
   * This function is executed asynchronously and can be used to perform
   * cleanup tasks or log server shutdown events.
   *
   * @param context - An object containing the logger instance.
   *
   * @example
   * ```typescript
   * const server = new Server(process.cwd(), {
   *   onClose: async ({ logger }) => {
   *     logger.info('Server closed');
   *   }
   * });
   * ```
   */
  onClose?: (context: { logger: Logger }) => Promise<void>

  /**
   * Callback function that is invoked before handling each request.
   *
   * This function is executed asynchronously before the main request handling logic.
   * It can be used for request preprocessing, authentication, logging, etc.
   *
   * @param req - The incoming HTTP request object.
   * @param res - The server response object.
   *
   * @example
   * ```typescript
   * const server = new Server(process.cwd(), {
   *   beforeHandle: async (req, res) => {
   *     console.log(`Processing ${req.method} request to ${req.url}`)
   *
   *     if (req.method !== 'POST')
   *       res.writeHead(405, { 'Allow': 'POST' }) // If you write response, it will finish the request
   *   }
   * });
   * ```
   */
  beforeHandle?: Middleware
}

/**
 * FaasJS Server.
 *
 * @param {string} root The root path of the server.
 * @param {ServerOptions} opts The options of the server.
 * @returns {Server}
 * @example
 * ```ts
 * import { Server } from '@faasjs/server'
 *
 * const server = new Server(process.cwd(), {
 *   port: 8080,
 * })
 *
 * server.listen()
 * ```
 */
export class Server {
  public readonly root: string
  public readonly logger: Logger
  public readonly options: ServerOptions

  protected closed = false

  private activeRequests = 0
  private cachedFuncs: {
    [path: string]: Cache
  } = {}

  private onError: (error: any) => void

  private server: HttpServer
  private sockets: Set<Socket> = new Set()

  constructor(root: string, opts: ServerOptions = {}) {
    if (!process.env.FaasEnv && process.env.NODE_ENV)
      process.env.FaasEnv = process.env.NODE_ENV

    this.root = root.endsWith(sep) ? root : root + sep
    this.options = deepMerge(
      {
        port: 3000,
      },
      opts
    )

    if (this.options.onClose && !types.isAsyncFunction(this.options.onClose))
      throw Error('onClose must be async function')
    if (this.options.onError && !types.isAsyncFunction(this.options.onError))
      throw Error('onError must be async function')
    if (this.options.onStart && !types.isAsyncFunction(this.options.onStart))
      throw Error('onStart must be async function')

    if (!process.env.FaasMode) process.env.FaasMode = 'mono'

    this.logger = new Logger(`server][${randomBytes(16).toString('hex')}`)
    this.logger.debug(
      'FaasJS server initialized: [%s] [%s] %s %j',
      process.env.FaasEnv,
      process.env.FaasMode,
      this.root,
      this.options
    )

    this.onError = (error: any) => {
      if (!(error instanceof Error)) error = Error(error)

      this.logger.error(error)

      if (this.options.onError)
        try {
          this.options.onError(error, {
            logger: this.logger,
          })
        } catch (error: any) {
          this.logger.error(error)
        }
    }

    servers.push(this)
  }

  public async handle(
    req: IncomingMessage,
    res: ServerResponse<IncomingMessage>,
    options: ServerHandlerOptions = {}
  ): Promise<void> {
    if (req.method === 'OPTIONS') {
      this.handleOptionRequest(req, res)
      return
    }

    const requestedAt = options.requestedAt || Date.now()

    const requestId =
      (req.headers['x-faasjs-request-id'] as string) ||
      (req.headers['x-request-id'] as string) ||
      `FS-${randomBytes(16).toString('hex')}`
    const logger = new Logger(requestId)

    logger.info('%s %s', req.method, req.url)

    const startedAt = Date.now()

    const path = join(this.root, req.url).replace(/\?.*/, '')

    await new Promise<void>(resolve => {
      let body = ''

      req.on('readable', () => {
        body += req.read() || ''
      })

      req.on('end', async () => {
        if (this.options.beforeHandle) {
          try {
            await this.options.beforeHandle(req, res, {
              logger,
            })

            if (res.writableEnded) {
              resolve()
              return
            }
          } catch (error: any) {
            logger.error(error)
            if (!res.headersSent) {
              res.statusCode = 500
              res.setHeader('Content-Type', 'application/json')
              res.write(JSON.stringify({ error: { message: error.message } }))
            }
            resolve()
            return
          }
        }
        let headers = buildCORSHeaders(req.headers, {
          'x-faasjs-request-id': requestId,
          'x-faasjs-timing-pending': (startedAt - requestedAt).toString(),
        })

        // get and remove accept-encoding to avoid http module compression
        const encoding = req.headers['accept-encoding'] || ''
        delete req.headers['accept-encoding']

        let data: any
        try {
          let cache: Cache = {}

          if (this.cachedFuncs[path]?.handler) {
            cache = this.cachedFuncs[path]
            logger.debug('response with cached %s', cache.file)
          } else {
            cache.file = options.filepath || this.getFilePath(path)
            logger.debug('response with %s', cache.file)

            const func = await loadPackage<Func>(cache.file, [
              'func',
              'default',
            ])

            func.config = loadConfig(
              this.root,
              path,
              process.env.FaasEnv || 'development',
              logger
            )
            if (!func.config) throw Error('No config file found')

            cache.handler = func.export().handler

            this.cachedFuncs[path] = cache
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

        if (!headers['x-faasjs-timing-processing'])
          headers['x-faasjs-timing-processing'] = (
            finishedAt - startedAt
          ).toString()

        if (!headers['x-faasjs-timing-total'])
          headers['x-faasjs-timing-total'] = (
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
            res.setHeader('Vary', 'accept-encoding')
            res.writeHead(200, { 'content-encoding': compression.type })

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

    const mounted: Record<string, Mounted> = {}

    if (this.options.onStart) {
      this.logger.debug('[onStart] begin')
      this.logger.time(`${this.logger.label}onStart`)
      this.options
        .onStart({
          logger: this.logger,
        })
        .catch(this.onError)
        .finally(() =>
          this.logger.timeEnd(`${this.logger.label}onStart`, '[onStart] end')
        )
    }

    this.server = createServer(async (req, res) => {
      this.activeRequests++

      res.on('finish', () => this.activeRequests--)

      // don't lock options request
      if (req.method === 'OPTIONS') return this.handleOptionRequest(req, res)

      const path = join(this.root, req.url).replace(/\?.*/, '')

      if (!mounted[path]) mounted[path] = { pending: [] } as Mounted

      mounted[path].pending.push([req, res, Date.now()])

      const pending = mounted[path].pending
      mounted[path].pending = []
      for (const event of pending)
        await this.handle(event[0], event[1], {
          requestedAt: event[2],
        })
    })
      .on('connection', socket => {
        this.sockets.add(socket)
        socket.on('close', () => {
          this.sockets.delete(socket)
        })
      })
      .on('error', e => {
        if ('code' in e && e.code === 'EADDRINUSE') {
          execSync(`lsof -i :${this.options.port}`, {
            stdio: 'inherit',
          })
          this.logger.error(
            'Port %s is already in use. Please kill the process or use another port.',
            this.options.port
          )
        }

        this.onError(e)
      })
      .listen(this.options.port, '0.0.0.0')

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

        if (!process.env.JEST_WORKER_ID && !process.env.VITEST_POOL_ID)
          process.exit(0)
      })
      .on('SIGINT', async () => {
        this.logger.debug('received SIGINT')

        if (this.closed) {
          this.logger.debug('already closed')
          return
        }

        await this.close()

        if (!process.env.JEST_WORKER_ID && !process.env.VITEST_POOL_ID)
          process.exit(0)
      })

    this.logger.info(
      '[%s] Listen http://localhost:%s with',
      process.env.FaasEnv,
      this.options.port,
      this.root
    )

    return this.server
  }

  /**
   * Close server.
   */
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

    if (this.options.onClose) {
      this.logger.debug('[onClose] begin')
      this.logger.time(`${this.logger.label}onClose`)
      try {
        await this.options.onClose({
          logger: this.logger,
        })
      } catch (error) {
        this.onError(error)
      }
      this.logger.timeEnd(`${this.logger.label}onClose`, '[onClose] end')
    }

    this.logger.timeEnd(`${this.logger.label}close`, 'closed')

    await getTransport().stop()

    this.closed = true
  }

  /**
   * Middleware function to handle incoming HTTP requests.
   *
   * @param req - The incoming HTTP request object.
   * @param res - The server response object.
   * @param next - A callback function to pass control to the next middleware.
   * @returns A promise that resolves when the middleware processing is complete.
   */
  public async middleware(
    req: IncomingMessage,
    res: ServerResponse<IncomingMessage>,
    next: () => void
  ): Promise<void> {
    try {
      const filepath = this.getFilePath(
        join(this.root, req.url).replace(/\?.*/, '')
      )

      await this.handle(req, res, {
        requestedAt: Date.now(),
        filepath,
      })
    } catch (error: any) {
      this.logger.debug('middleware error', error)
    }

    next()
  }

  private getFilePath(path: string) {
    // Safe check
    if (/^(\.|\|\/)+$/.test(path)) throw Error('Illegal characters')

    const searchPaths = getRouteFiles(this.root, path)

    for (const path of searchPaths) {
      if (existsSync(path)) return resolve('.', path)
    }

    const message =
      process.env.FaasEnv === 'production'
        ? 'Not found.'
        : `Not found function file.\nSearch paths:\n${searchPaths
            .map(p => `- ${p}`)
            .join('\n')}`

    throw new HttpError({
      statusCode: 404,
      message,
    })
  }

  private handleOptionRequest(
    req: IncomingMessage,
    res: ServerResponse<IncomingMessage>
  ): void {
    res.writeHead(204, buildCORSHeaders(req.headers))
    res.end()
    return
  }
}
