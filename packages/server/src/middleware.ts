import { randomUUID } from 'node:crypto'
import { createReadStream, existsSync } from 'node:fs'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { resolve } from 'node:path'
import { nameFunc, useFunc } from '@faasjs/func'
import { Logger } from '@faasjs/logger'
import { lookup } from 'mime-types'

export type MiddlewareEvent = {
  body: any
  raw: {
    request: IncomingMessage
    response: ServerResponse
  }
}

export type Middleware = (
  request: IncomingMessage & { body?: any },
  response: ServerResponse,
  logger: Logger
) => void | Promise<void>

async function invokeMiddleware(
  event: MiddlewareEvent,
  logger: Logger,
  handler: Middleware
) {
  const loggerKey = randomUUID()
  const handlerLogger = new Logger(
    `${logger.label}] [middleware] [${handler.name || 'uname'}`
  )
  handlerLogger.debug('begin')
  handlerLogger.time(loggerKey, 'debug')
  try {
    await handler(
      Object.assign(event.raw.request, { body: event.body }),
      event.raw.response,
      handlerLogger
    )
  } catch (error) {
    handlerLogger.error('error:', error)
    event.raw.response.statusCode = 500
    event.raw.response.end(error.toString())
  } finally {
    handlerLogger.timeEnd(loggerKey, 'end')
  }
}

/**
 * Apply a middleware function to handle incoming requests.
 *
 * @param handler - The middleware function to handle the request and response.
 * @returns A function that processes the event and applies the middleware.
 *
 * @example
 * ```typescript
 * import { useMiddleware } from '@faasjs/server'
 *
 * export const func = useMiddleware((request, response, logger) => {
 *   response.setHeader('X-Hello', 'World')
 *   response.end('Hello, World!')
 *   logger.info('Hello, World!')
 * })
 * ```
 */
export async function useMiddleware(handler: Middleware) {
  return useFunc<MiddlewareEvent>(() => async ({ event, logger }) => {
    await invokeMiddleware(event, logger, handler)

    if (!event.raw.response.writableEnded) {
      event.raw.response.statusCode = 404
      event.raw.response.end('Not Found')
    }
  })
}

/**
 * Apply an array of middleware functions to an event.
 *
 * @param {Middleware[]} handlers - An array of middleware functions to be applied.
 * @returns {Promise<void>} A promise that resolves when all middleware functions have been applied.
 *
 * @example
 * ```typescript
 * import { useMiddlewares } from '@faasjs/server'
 *
 * export const func = useMiddlewares([
 *   (request, response) => {
 *     if (request.url === '/hi') return
 *     response.end('Hello, World!')
 *   },
 *   (request, response) => {
 *     if (request.url === '/hello') return
 *     response.end('Hi, World!')
 *   }
 * ])
 * ```
 */
export async function useMiddlewares(handlers: Middleware[]) {
  return useFunc<MiddlewareEvent>(() => async ({ event, logger }) => {
    for (const handler of handlers) {
      if (event.raw.response.writableEnded) break

      await invokeMiddleware(event, logger, handler)
    }

    if (!event.raw.response.writableEnded) {
      event.raw.response.statusCode = 404
      event.raw.response.end('Not Found')
    }
  })
}

export type StaticHandlerOptions = {
  root: string
  /**
   * Not found handler.
   *
   * If set to `true`, the middleware will respond with a default 404 status code.
   * If set to a function, the middleware will call the function with the request, response, and logger.
   * If set to `false`, the middleware will do nothing.
   *
   * @default false
   */
  notFound?: Middleware | boolean
  /**
   * Cache static files.
   * If set to `true`, the middleware will cache static files.
   * If set to a string, the middleware will cache static files with the specified key.
   * If set to `false`, the middleware will not cache static files.
   *
   * @default true
   */
  cache?: boolean | string
  /**
   * Strip prefix from the URL.
   *
   * @example
   * ```typescript
   * import { useMiddleware, staticHandler } from '@faasjs/server'
   *
   * export const func = useMiddleware(staticHandler({ root: __dirname + '/public', stripPrefix: '/public' })) // /public/index.html -> /index.html
   * ```
   */
  stripPrefix?: string | RegExp
}

type StaticHandlerCache =
  | {
    path: string
    mimeType: string
  }
  | false

const cachedStaticFiles = new Map<string, StaticHandlerCache>()

async function respondWithNotFound(
  options: StaticHandlerOptions['notFound'],
  request: IncomingMessage & {
    body?: any
  },
  response: ServerResponse,
  logger: Logger
) {
  if (!options) return
  if (options === true) {
    response.statusCode = 404
    response.end('Not Found')
    return
  }

  return await options(request, response, logger)
}

async function respondWithFile(
  path: string,
  mimeType: string,
  response: ServerResponse
) {
  const stream = createReadStream(path)
  response.setHeader('Content-Type', mimeType)

  await new Promise<void>((resolve, reject) => {
    stream
      .on('error', error => {
        response.statusCode = 500
        response.end(error?.message || 'Internal Server Error')
        reject(error)
      })
      .on('end', resolve)

    stream.pipe(response)
  })
}

/**
 * Middleware to handle static file requests.
 *
 * @param {StaticHandlerOptions} options - Options for the static handler.
 * @returns {Middleware} The middleware function.
 *
 * The middleware resolves the requested URL to a file path within the specified root directory.
 * If the file exists, it reads the file content and sends it in the response.
 * If the file does not exist, it does nothing.
 *
 * @example
 * ```typescript
 * import { useMiddleware, staticHandler } from '@faasjs/server'
 *
 * export const func = useMiddleware(staticHandler({ root: __dirname + '/public' }))
 * ```
 */
export function staticHandler(options: StaticHandlerOptions): Middleware {
  const handler: Middleware = async (request, response, logger) => {
    if (request.method !== 'GET' || request.url.slice(0, 2) === '/.') return

    const cacheKey =
      options.cache !== false
        ? `${options.cache || options.root}${request.url}`
        : null

    if (cacheKey) {
      const cached = cachedStaticFiles.get(cacheKey)

      if (cached === false)
        return await respondWithNotFound(
          options.notFound,
          request,
          response,
          logger
        )

      if (cached) {
        response.setHeader('Content-Type', cached.mimeType)

        return await respondWithFile(cached.path, cached.mimeType, response)
      }
    }

    let url = options.stripPrefix
      ? request.url.replace(options.stripPrefix, '')
      : request.url

    if (url === '/') url = '/index.html'

    if (url.startsWith('/')) url = url.slice(1)

    logger.debug('finding:', request.url)

    const path = resolve(options.root, url)

    if (!existsSync(path)) {
      logger.debug('not found:', path)

      if (cacheKey) cachedStaticFiles.set(cacheKey, false)

      return await respondWithNotFound(
        options.notFound,
        request,
        response,
        logger
      )
    }

    const mimeType = lookup(path) || 'application/octet-stream'

    logger.debug('found:', mimeType, url)

    if (cacheKey)
      cachedStaticFiles.set(cacheKey, {
        path,
        mimeType,
      })

    return await respondWithFile(path, mimeType, response)
  }

  // Set the name of the handler function for better debugging and logging
  nameFunc('static', handler)

  return handler
}
