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
import {
  deepMerge,
  getTransport,
  loadConfig,
  loadEnvFileIfExists,
  loadPackage,
  Logger,
} from '@faasjs/node-utils'
import { mountServerCronJobs, unmountServerCronJobs } from '../cron'
import type { Func } from '../func'
import { HttpError } from '../http'
import type { Middleware } from '../middleware'
import { ensureRequestUrl } from '../request-url'
import {
  getErrorMessage,
  getErrorStatusCode,
  INTERNAL_SERVER_ERROR_MESSAGE,
  respondWithInternalServerError,
  respondWithJsonError,
} from '../response-error'
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

  /**
   * Whether to mount cron job lifecycle with this server instance.
   *
   * When enabled, `server.listen()` mounts registered cron jobs and
   * `server.close()` unmounts them.
   *
   * @default true
   */
  cronJob?: boolean
}

/**
 * FaasJS Server.
 *
 * @param {string} root The root path of the server.
 * @param {ServerOptions} opts The options of the server.
 * @returns {Server}
 * @example
 * ```ts
 * import { Server } from '@faasjs/core'
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

  private server: HttpServer | undefined
  private sockets: Set<Socket> = new Set()

  constructor(root: string, opts: ServerOptions = {}) {
    loadEnvFileIfExists()

    if (!process.env.FaasEnv && process.env.NODE_ENV) process.env.FaasEnv = process.env.NODE_ENV

    this.root = root.endsWith(sep) ? root : root + sep
    this.options = deepMerge(
      {
        port: 3000,
        cronJob: true,
      },
      opts,
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
      this.options,
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
    options: ServerHandlerOptions = {},
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

    const requestUrl = ensureRequestUrl(req, res)
    if (!requestUrl) return

    const startedAt = Date.now()
    const path = join(this.root, requestUrl).replace(/\?.*/, '')
    const body = await this.readRequestBody(req)

    if (!(await this.runBeforeHandle(req, res, logger))) return

    let data: any
    try {
      const cache = await this.getOrLoadHandler(path, options.filepath, logger)
      data = await this.invokeHandler(cache, req, res, requestUrl, body, requestId)
    } catch (error: any) {
      logger.error(error)
      data = error
    }

    if (res.writableEnded) return

    const headers = this.buildResponseHeaders(req, requestId, requestedAt, startedAt, data)
    for (const key in headers) res.setHeader(key, headers[key] as string)

    if (data instanceof Response) {
      res.statusCode = data.status

      const reader = data.body?.getReader()

      if (reader) {
        const stream = Readable.from(
          (async function* () {
            while (true) {
              try {
                const { done, value } = await reader.read()
                if (done) break
                if (value) yield value
              } catch (error: any) {
                logger.error(error)
                break
              }
            }
          })(),
        )

        await new Promise<void>((done) => {
          this.pipeToResponse(stream, res, done)
        })

        return
      }

      res.end()
      return
    }

    if (data.body instanceof ReadableStream) {
      if (typeof data.statusCode === 'number') res.statusCode = data.statusCode

      await new Promise<void>((done) => {
        this.pipeToResponse(Readable.fromWeb(data.body), res, done)
      })

      return
    }

    const statusCode = getErrorStatusCode(data)

    if (statusCode === 500) {
      respondWithJsonError(res, 500, getErrorMessage(data))
      return
    }

    let resBody: string | Buffer | undefined
    if (
      data instanceof Error ||
      data?.constructor?.name?.includes('Error') ||
      typeof data === 'undefined' ||
      data === null
    ) {
      if (typeof statusCode === 'number')
        respondWithJsonError(
          res,
          statusCode,
          getErrorMessage(data, statusCode === 500 ? INTERNAL_SERVER_ERROR_MESSAGE : 'No response'),
        )
      else respondWithInternalServerError(res)

      return
    }

    if (typeof statusCode === 'number') res.statusCode = statusCode

    if (data.body) resBody = data.body

    if (typeof resBody !== 'undefined') {
      logger.debug('Response %s %j', res.statusCode, headers)
      res.write(resBody)
    }

    res.end()
  }

  private readRequestBody(req: IncomingMessage): Promise<string> {
    return new Promise((resolve) => {
      let body = ''

      req.on('readable', () => {
        body += req.read() || ''
      })

      req.on('end', () => {
        resolve(body)
      })
    })
  }

  private async runBeforeHandle(
    req: IncomingMessage,
    res: ServerResponse<IncomingMessage>,
    logger: Logger,
  ): Promise<boolean> {
    if (!this.options.beforeHandle) return true

    try {
      await this.options.beforeHandle(req, res, {
        logger,
      })

      return !res.writableEnded
    } catch (error: any) {
      logger.error(error)
      respondWithInternalServerError(res)

      return false
    }
  }

  private async getOrLoadHandler(
    path: string,
    filepath: string | undefined,
    logger: Logger,
  ): Promise<Cache> {
    const cached = this.cachedFuncs[path]
    if (cached?.handler) {
      logger.debug('response with cached %s', cached.file)
      return cached
    }

    const file = filepath || this.getFilePath(path)
    const cache: Cache = {
      file,
    }
    logger.debug('response with %s', cache.file)

    const func = await loadPackage<Func>(file, ['func', 'default'])

    func.config = loadConfig(this.root, path, process.env.FaasEnv || 'development', logger)
    if (!func.config) throw Error('No config file found')

    cache.handler = func.export().handler

    this.cachedFuncs[path] = cache

    return cache
  }

  private async invokeHandler(
    cache: Cache,
    req: IncomingMessage,
    res: ServerResponse<IncomingMessage>,
    requestUrl: string,
    body: string,
    requestId: string,
  ): Promise<any> {
    const url = new URL(requestUrl, `http://${req.headers.host}`)

    if (!cache.handler) throw Error('handler is undefined')

    return cache.handler(
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
      { request_id: requestId },
    )
  }

  private buildResponseHeaders(
    req: IncomingMessage,
    requestId: string,
    requestedAt: number,
    startedAt: number,
    data: any,
  ) {
    const finishedAt = Date.now()

    let headers = buildCORSHeaders(req.headers, {
      'x-faasjs-request-id': requestId,
      'x-faasjs-timing-pending': (startedAt - requestedAt).toString(),
    })

    if (data.headers) headers = Object.assign(headers, data.headers)

    if (!headers['x-faasjs-timing-processing'])
      headers['x-faasjs-timing-processing'] = (finishedAt - startedAt).toString()

    if (!headers['x-faasjs-timing-total'])
      headers['x-faasjs-timing-total'] = (finishedAt - requestedAt).toString()

    Object.freeze(headers)

    return headers
  }

  private pipeToResponse(
    stream: Readable,
    res: ServerResponse<IncomingMessage>,
    done: () => void,
  ): void {
    stream
      .pipe(res)
      .on('finish', () => {
        res.end()
        done()
      })
      .on('error', (err) => {
        this.onError(err)
        respondWithInternalServerError(res)
        done()
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
        .finally(() => this.logger.timeEnd(`${this.logger.label}onStart`, '[onStart] end'))
    }

    this.server = createServer(async (req, res) => {
      this.activeRequests++

      res.on('finish', () => this.activeRequests--)

      // don't lock options request
      if (req.method === 'OPTIONS') return this.handleOptionRequest(req, res)

      const requestUrl = ensureRequestUrl(req, res)
      if (!requestUrl) return

      const path = join(this.root, requestUrl).replace(/\?.*/, '')

      if (!mounted[path]) mounted[path] = { pending: [] } as Mounted

      mounted[path].pending.push([req, res, Date.now()])

      const pending = mounted[path].pending
      mounted[path].pending = []
      for (const event of pending)
        await this.handle(event[0], event[1], {
          requestedAt: event[2],
        })
    })
      .on('connection', (socket) => {
        this.sockets.add(socket)
        socket.on('close', () => {
          this.sockets.delete(socket)
        })
      })
      .on('error', (e) => {
        if ('code' in e && e.code === 'EADDRINUSE') {
          execSync(`lsof -i :${this.options.port}`, {
            stdio: 'inherit',
          })
          this.logger.error(
            'Port %s is already in use. Please kill the process or use another port.',
            this.options.port,
          )
        }

        this.onError(e)
      })
      .listen(this.options.port, '0.0.0.0')

    if (this.options.cronJob)
      try {
        mountServerCronJobs()
      } catch (error) {
        this.onError(error)
      }

    process
      .on('uncaughtException', (e) => {
        this.logger.debug('Uncaught exception')
        this.onError(e)
      })
      .on('unhandledRejection', (e) => {
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

        if (!process.env.JEST_WORKER_ID && !process.env.VITEST_POOL_ID) process.exit(0)
      })
      .on('SIGINT', async () => {
        this.logger.debug('received SIGINT')

        if (this.closed) {
          this.logger.debug('already closed')
          return
        }

        await this.close()

        if (!process.env.JEST_WORKER_ID && !process.env.VITEST_POOL_ID) process.exit(0)
      })

    this.logger.info(
      '[%s] Listen http://localhost:%s with',
      process.env.FaasEnv,
      this.options.port,
      this.root,
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

    if (this.options.cronJob)
      try {
        unmountServerCronJobs()
      } catch (error) {
        this.onError(error)
      }

    if (this.activeRequests) {
      await new Promise<void>((resolve) => {
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

    const server = this.server
    if (server)
      await new Promise<void>((resolve) => {
        server.close((err) => {
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
    next: () => void,
  ): Promise<void> {
    const requestUrl = ensureRequestUrl(req, res)
    if (!requestUrl) {
      next()
      return
    }

    try {
      const filepath = this.getFilePath(join(this.root, requestUrl).replace(/\?.*/, ''))

      await this.handle(req, res, {
        requestedAt: Date.now(),
        filepath,
      })
    } catch (error: any) {
      this.logger.debug('middleware error', error)
    }

    next()
  }

  private getFilePath(path: string): string {
    // Safe check
    if (/^(\.|\|\/)+$/.test(path)) throw Error('Illegal characters')

    const searchPaths = getRouteFiles(this.root, path)

    for (const path of searchPaths) {
      if (existsSync(path)) return resolve('.', path)
    }

    const message =
      process.env.FaasEnv === 'production'
        ? 'Not found.'
        : `Not found function file.\nSearch paths:\n${searchPaths.map((p) => `- ${p}`).join('\n')}`

    throw new HttpError({
      statusCode: 404,
      message,
    })
  }

  private handleOptionRequest(req: IncomingMessage, res: ServerResponse<IncomingMessage>): void {
    res.writeHead(204, buildCORSHeaders(req.headers))
    res.end()
    return
  }
}
