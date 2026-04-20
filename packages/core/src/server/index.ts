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
import { dirname, join, resolve, sep } from 'node:path'
import { Readable } from 'node:stream'
import { types } from 'node:util'

import {
  getTransport,
  isPathInsideRoot,
  loadPackage,
  loadPlugins,
  Logger,
} from '@faasjs/node-utils'
import { deepMerge } from '@faasjs/utils'

import { mountServerCronJobs, unmountServerCronJobs } from '../cron'
import type { Func } from '../func'
import type { Middleware } from '../middleware'
import { HttpError } from '../plugins/http'
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

/**
 * Extra options for a single {@link Server.handle} call.
 */
export type ServerHandlerOptions = {
  /**
   * Explicit request start timestamp used for response timing headers.
   */
  requestedAt?: number
  /**
   * Force a specific API file path instead of route lookup.
   */
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

/**
 * Return all server instances created in the current process.
 *
 * @returns {Server[]} Server instances tracked by the current process.
 *
 * @example
 * ```ts
 * import { Server, getAll } from '@faasjs/core'
 *
 * const server = new Server(process.cwd())
 *
 * getAll().includes(server)
 * ```
 */
export function getAll(): Server[] {
  return servers
}

/**
 * Close every tracked server instance.
 *
 * @returns {Promise<void>} Promise that resolves after all servers close.
 *
 * @example
 * ```ts
 * import { Server, closeAll } from '@faasjs/core'
 *
 * const server = new Server(process.cwd())
 * server.listen()
 *
 * await closeAll()
 * ```
 */
export async function closeAll(): Promise<void> {
  for (const server of [...servers]) await server.close()
}

/**
 * Configuration options for {@link Server}.
 */
export type ServerOptions = {
  /**
   * Port used by {@link Server.listen}.
   *
   * @default 3000
   */
  port?: number

  /**
   * Async hook invoked after the server starts listening.
   *
   * Errors thrown by this hook are reported through the server error logger.
   *
   * @param {object} context - Lifecycle context passed to the start hook.
   * @param {Logger} context.logger - Shared server logger instance.
   * @returns {Promise<void>} Promise returned by the start hook.
   *
   * @example
   * ```ts
   * const server = new Server(process.cwd(), {
   *   onStart: async ({ logger }) => {
   *     logger.info('Server started')
   *   },
   * })
   * ```
   */
  onStart?: (context: { logger: Logger }) => Promise<void>

  /**
   * Async hook invoked when server-level errors occur.
   *
   * This hook receives normalized `Error` instances.
   *
   * @param {Error} error - Error raised during server operation.
   * @param {object} context - Lifecycle context passed to the error hook.
   * @param {Logger} context.logger - Shared server logger instance.
   * @returns {Promise<void>} Promise returned by the error hook.
   *
   * @example
   * ```ts
   * const server = new Server(process.cwd(), {
   *   onError: async (error, { logger }) => {
   *     logger.error(error)
   *   },
   * })
   * ```
   */
  onError?: (error: Error, context: { logger: Logger }) => Promise<void>

  /**
   * Async hook invoked after the server closes.
   *
   * Use this hook for cleanup or shutdown logging.
   *
   * @param {object} context - Lifecycle context passed to the close hook.
   * @param {Logger} context.logger - Shared server logger instance.
   * @returns {Promise<void>} Promise returned by the close hook.
   *
   * @example
   * ```ts
   * const server = new Server(process.cwd(), {
   *   onClose: async ({ logger }) => {
   *     logger.info('Server closed')
   *   },
   * })
   * ```
   */
  onClose?: (context: { logger: Logger }) => Promise<void>

  /**
   * Middleware invoked before each request is dispatched to a FaasJS function.
   *
   * Write to the response to short-circuit normal request handling.
   *
   * @example
   * ```ts
   * const server = new Server(process.cwd(), {
   *   beforeHandle: async (req, res) => {
   *     console.log(`Processing ${req.method} request to ${req.url}`)
   *
   *     if (req.method !== 'POST') res.writeHead(405, { Allow: 'POST' })
   *   },
   * })
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
 * HTTP server that loads and runs FaasJS API files from a project root.
 *
 * A {@link Server} resolves API route files on demand, caches loaded handlers, and
 * can optionally mount cron jobs for the process lifecycle.
 *
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
  /**
   * Normalized project root used to resolve route files.
   */
  public readonly root: string
  /**
   * Shared server logger.
   */
  public readonly logger: Logger
  /**
   * Effective server options with defaults applied.
   */
  public readonly options: ServerOptions

  protected closed = false

  private activeRequests = 0
  private cachedFuncs: {
    [path: string]: Cache
  } = {}

  private onError: (error: any) => void

  private server: HttpServer | undefined
  private sockets: Set<Socket> = new Set()

  /**
   * Create a server rooted at a FaasJS project directory.
   *
   * @param {string} root - Root directory used to resolve configuration and route files.
   * @param {ServerOptions} [opts] - Server configuration overrides.
   * @param {number} [opts.port] - Port used by `listen()`. Defaults to `3000`.
   * @param {ServerOptions['onStart']} [opts.onStart] - Async hook invoked after the server starts listening.
   * @param {ServerOptions['onError']} [opts.onError] - Async hook invoked when server-level errors occur.
   * @param {ServerOptions['onClose']} [opts.onClose] - Async hook invoked after the server closes.
   * @param {Middleware} [opts.beforeHandle] - Middleware hook invoked before each request is dispatched.
   * @param {boolean} [opts.cronJob] - Whether server lifecycle should mount registered cron jobs.
   * @throws {Error} When `onStart`, `onError`, or `onClose` is not an async function.
   */
  constructor(root: string, opts: ServerOptions = {}) {
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

    this.logger = new Logger(`server][${randomBytes(16).toString('hex')}`)
    this.logger.debug(
      'FaasJS server initialized: [%s] %s %j',
      process.env.FaasEnv,
      this.root,
      this.options,
    )

    this.onError = async (error: any) => {
      if (!(error instanceof Error)) error = Error(error)

      this.logger.error(error)

      if (this.options.onError)
        try {
          await this.options.onError(error, {
            logger: this.logger,
          })
        } catch (error: any) {
          this.logger.error(error)
        }
    }

    servers.push(this)
  }

  /**
   * Handle a single incoming HTTP request.
   *
   * @param {IncomingMessage} req - Incoming Node.js request.
   * @param {ServerResponse<IncomingMessage>} res - Node.js response writer.
   * @param {ServerHandlerOptions} [options] - Optional request metadata and forced filepath override.
   * @param {number} [options.requestedAt] - Explicit request start timestamp used for response headers.
   * @param {string} [options.filepath] - Force a specific API file path instead of route lookup.
   * @returns {Promise<void>} Promise that resolves after the request has been handled.
   */
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
        root: this.root,
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

    const srcRoot = resolve(this.root)
    const projectTsconfig = join(resolve(srcRoot, '..'), 'tsconfig.json')
    const srcTsconfig = join(srcRoot, 'tsconfig.json')
    const tsconfigPath = existsSync(projectTsconfig)
      ? projectTsconfig
      : existsSync(srcTsconfig)
        ? srcTsconfig
        : undefined

    const loadOptions: Parameters<typeof loadPackage>[2] = {
      root: tsconfigPath ? dirname(tsconfigPath) : resolve(srcRoot, '..'),
    }

    if (tsconfigPath) loadOptions.tsconfigPath = tsconfigPath

    if (process.env.FAASJS_MODULE_VERSION) loadOptions.version = process.env.FAASJS_MODULE_VERSION

    const func = await loadPackage<Func>(file, ['default', 'func'], loadOptions)

    await loadPlugins(func, {
      root: this.root,
      filename: path,
      staging: process.env.FaasEnv || 'development',
      logger,
    })
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
      {
        request_id: requestId,
        root: this.root,
      },
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
   * Start the underlying Node.js HTTP server.
   *
   * @returns {HttpServer} Underlying Node.js server instance.
   * @throws {Error} When the server is already running.
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

      // Let CORS preflight requests bypass the per-route mount queue.
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
   * Close the server and wait for active requests to finish.
   *
   * @returns {Promise<void>} Promise that resolves after sockets, cron jobs, and transports stop.
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

    const index = servers.indexOf(this)
    if (index !== -1) servers.splice(index, 1)

    if (servers.length === 0) await getTransport().stop()

    this.closed = true
  }

  /**
   * Express-style middleware wrapper that delegates to {@link Server.handle}.
   *
   * @param {IncomingMessage} req - Incoming HTTP request object.
   * @param {ServerResponse<IncomingMessage>} res - Server response object.
   * @param {() => void} next - Callback used to continue the middleware chain when FaasJS does not handle the request.
   * @returns {Promise<void>} Promise that resolves when middleware processing finishes.
   */
  public async middleware(
    req: IncomingMessage,
    res: ServerResponse<IncomingMessage>,
    next: () => void,
  ): Promise<void> {
    const requestUrl = ensureRequestUrl(req, res)
    if (!requestUrl) return

    try {
      const filepath = this.getFilePath(join(this.root, requestUrl).replace(/\?.*/, ''))

      await this.handle(req, res, {
        requestedAt: Date.now(),
        filepath,
      })
    } catch (error: any) {
      this.logger.debug('middleware error', error)
    }

    if (res.headersSent || res.writableEnded) return

    next()
  }

  private getFilePath(path: string): string {
    if (!isPathInsideRoot(path, this.root))
      throw new HttpError({
        statusCode: 404,
        message: 'Not found.',
      })

    const searchPaths = getRouteFiles(this.root, path)

    for (const path of searchPaths) {
      if (existsSync(path)) return resolve('.', path)
    }

    const message =
      process.env.FaasEnv === 'production'
        ? 'Not found.'
        : `Not found API file.\nSearch paths:\n${searchPaths.map((p) => `- ${p}`).join('\n')}`

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
