import { randomUUID } from 'node:crypto'
import { createReadStream, existsSync } from 'node:fs'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { resolve } from 'node:path'
import { useFunc } from '@faasjs/func'
import type { Logger } from '@faasjs/logger'
import { lookup } from 'mime-types'

export type MiddlewareEvent = {
  body: any
  raw: {
    request: IncomingMessage
    response: ServerResponse
  }
}

export type Middleware = (
  request: IncomingMessage & { body: any },
  response: ServerResponse,
  logger: Logger
) => void | Promise<void>

async function invokeMiddleware(
  event: MiddlewareEvent,
  logger: Logger,
  handler: Middleware
) {
  const loggerKey = randomUUID()
  logger.debug('[middleware] [%s] begin', handler.name || 'anonymous')
  logger.time(loggerKey, 'debug')
  try {
    await handler(
      Object.assign(event.raw.request, { body: event.body }),
      event.raw.response,
      logger
    )
  } catch (error) {
    logger.error('[middleware] [%s] error:', handler.name || 'anonymous', error)
    event.raw.response.statusCode = 500
    event.raw.response.end(error.toString())
  } finally {
    logger.timeEnd(
      loggerKey,
      '[middleware] [%s] end',
      handler.name || 'anonymous'
    )
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
 * export default useMiddleware((request, response, logger) => {
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
 * export default useMiddlewares([
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
  root: `${string}/`
  notFound?: Middleware | true
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
 * export default useMiddleware(staticHandler({ root: __dirname + '/public' }))
 * ```
 */
export function staticHandler(options: StaticHandlerOptions): Middleware {
  return async (request, response, logger) => {
    if (request.method !== 'GET') return

    if (request.url.slice(0, 2) === '/.') return

    let url = request.url.slice(1)

    if (url === '') url = 'index.html'

    logger.debug('[middleware] [static] finding:', request.url)

    const path = resolve(options.root, url)

    if (!existsSync(path)) {
      if (options.notFound) {
        logger.debug('[middleware] [static] not found:', url)

        if (options.notFound === true) {
          response.statusCode = 404
          response.end('Not Found')
          return
        }

        await options.notFound(request, response, logger)
      }

      return
    }

    const stream = createReadStream(path)

    const mimeType = lookup(path) || 'application/octet-stream'
    response.setHeader('Content-Type', mimeType)

    logger.debug('[middleware] [static] found:', mimeType, url)

    await new Promise<void>((resolve, reject) => {
      stream
        .on('error', error => {
          logger.error('[static] error:', error)
          response.statusCode = 500
          response.end(error?.message || 'Internal Server Error')
          reject(error)
        })
        .on('end', resolve)

      stream.pipe(response)
    })
  }
}

Object.defineProperty(staticHandler, 'name', { value: 'staticHandler' })
