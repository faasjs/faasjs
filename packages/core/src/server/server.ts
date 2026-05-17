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
import { types } from 'node:util'

import {
  getTransport,
  isPathInsideRoot,
  loadPackage,
  loadPlugins,
  Logger,
  registerNodeModuleHooks,
  type RegisterNodeModuleHooksOptions,
} from '@faasjs/node-utils'
import { deepMerge } from '@faasjs/utils'

import type { Func } from '../func'
import { HttpError } from '../plugins/http'
import { ensureRequestUrl } from '../request-url'
import { getErrorMessage, getErrorStatusCode, respondWithJsonError } from '../response-error'
import {
  readRequestBody,
  runBeforeHandle,
  invokeHandler,
  buildResponseHeaders,
  respondWithStreamData,
  respondWithError,
  handleOptionRequest,
} from './request-handler'
import { getRouteFiles } from './routes'
import type { Cache, Mounted, ServerHandlerOptions, ServerOptions } from './types'
import { loadServerEnvFile } from './utils'

const servers: Server[] = []

/**
 * Return all server instances created in the current process.
 *
 * @returns {Server[]} Server instances tracked by the current process.
 *
 * @example
 * ```ts
 * import { join } from 'node:path'
 * import { Server, getAll } from '@faasjs/core'
 *
 * const server = new Server(join(process.cwd(), 'src'))
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
 * import { join } from 'node:path'
 * import { Server, closeAll } from '@faasjs/core'
 *
 * const server = new Server(join(process.cwd(), 'src'))
 * server.listen()
 *
 * await closeAll()
 * ```
 */
export async function closeAll(): Promise<void> {
  for (const server of servers.slice()) await server.close()
}

/**
 * HTTP server that loads and runs FaasJS API files from an app source root.
 *
 * A {@link Server} resolves API route files on demand, caches loaded handlers, and
 * dispatches each request through the matching function lifecycle.
 *
 * @example
 * ```ts
 * import { join } from 'node:path'
 * import { Server } from '@faasjs/core'
 *
 * const server = new Server(join(process.cwd(), 'src'), {
 *   port: 8080,
 * })
 *
 * server.listen()
 * ```
 */
export class Server {
  /**
   * Normalized app source root used to resolve route files.
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
  private cachedApis: {
    [path: string]: Cache
  } = {}

  private onError: (error: any) => void

  private server: HttpServer | undefined
  private sockets: Set<Socket> = new Set()

  /**
   * Create a server rooted at a FaasJS app source directory.
   *
   * @param {string} root - App source root used to resolve configuration and route files.
   * @param {ServerOptions} [opts] - Server configuration overrides.
   * @param {number} [opts.port] - Port used by `listen()`. Defaults to `3000`.
   * @param {ServerOptions['onStart']} [opts.onStart] - Async hook invoked after the server starts listening.
   * @param {ServerOptions['onError']} [opts.onError] - Async hook invoked when server-level errors occur.
   * @param {ServerOptions['onClose']} [opts.onClose] - Async hook invoked after the server closes.
   * @param {Middleware} [opts.beforeHandle] - Middleware hook invoked before each request is dispatched.
   * @throws {Error} When `onStart`, `onError`, or `onClose` is not an async function.
   */
  constructor(root: string, opts: ServerOptions = {}) {
    this.root = root.endsWith(sep) ? root : root + sep
    loadServerEnvFile(this.root)

    this.options = deepMerge(
      {
        port: 3000,
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
      handleOptionRequest(req, res)
      return
    }

    const requestedAt = options.requestedAt || Date.now()

    const requestId =
      (req.headers['x-faasjs-request-id'] as string) || `FS-${randomBytes(16).toString('hex')}`
    const logger = new Logger(requestId)

    logger.info('%s %s', req.method, req.url)

    const requestUrl = ensureRequestUrl(req, res)
    if (!requestUrl) return

    const startedAt = Date.now()
    const path = join(this.root, requestUrl).replace(/\?.*/, '')
    const body = await readRequestBody(req)

    if (!(await runBeforeHandle(this.options.beforeHandle, req, res, this.root, logger))) return

    let data: any
    try {
      const cache = await this.getOrLoadHandler(path, options.filepath, logger)
      data = await invokeHandler(cache.handler!, req, res, requestUrl, body, requestId, this.root)
    } catch (error: any) {
      logger.error(error)
      data = error
    }

    if (res.writableEnded) return

    const headers = buildResponseHeaders(req, requestId, requestedAt, startedAt, data)
    for (const key in headers) res.setHeader(key, headers[key] as string)

    if (await respondWithStreamData(data, res, logger, this.onError)) return

    const statusCode = getErrorStatusCode(data)

    if (statusCode === 500) {
      respondWithJsonError(res, 500, getErrorMessage(data))
      return
    }

    respondWithError(data, res, statusCode, logger)
  }

  private async getOrLoadHandler(
    path: string,
    filepath: string | undefined,
    logger: Logger,
  ): Promise<Cache> {
    const cached = this.cachedApis[path]
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
    const tsconfigPath = existsSync(projectTsconfig) ? projectTsconfig : undefined

    const hookOptions: RegisterNodeModuleHooksOptions = {
      root: tsconfigPath ? dirname(tsconfigPath) : resolve(srcRoot, '..'),
    }

    if (tsconfigPath) hookOptions.tsconfigPath = tsconfigPath

    if (process.env.FAASJS_MODULE_VERSION) hookOptions.version = process.env.FAASJS_MODULE_VERSION

    registerNodeModuleHooks(hookOptions)

    const api = await loadPackage<Func>(file)

    if (!api || typeof api.export !== 'function')
      throw Error(`API module "${file}" must export a FaasJS API instance as default`)

    await loadPlugins(api, {
      root: this.root,
      filename: path,
      staging: process.env.FaasEnv || 'development',
      logger,
    })
    if (!api.config) throw Error('No config file found')

    cache.handler = api.export().handler

    this.cachedApis[path] = cache

    return cache
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
      if (req.method === 'OPTIONS') return handleOptionRequest(req, res)

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

        if (!process.env.VITEST_POOL_ID) process.exit(0)
      })
      .on('SIGINT', async () => {
        this.logger.debug('received SIGINT')

        if (this.closed) {
          this.logger.debug('already closed')
          return
        }

        await this.close()

        if (!process.env.VITEST_POOL_ID) process.exit(0)
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
   * @returns {Promise<void>} Promise that resolves after sockets, requests, and transports stop.
   */
  public async close(): Promise<void> {
    if (this.closed) {
      this.logger.debug('already closed')
      return
    }

    this.logger.debug('closing')
    this.logger.time(`${this.logger.label}close`)

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
}
