import { createReadStream, existsSync } from 'node:fs'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { resolve } from 'node:path'
import { useFunc } from '@faasjs/func'
import type { Logger } from '@faasjs/logger'
import { lookup } from 'mime-types'

export type RawEvent = {
  request: IncomingMessage
  response: ServerResponse
}

export type Middleware = (
  request: IncomingMessage,
  response: ServerResponse,
  logger: Logger
) => void | Promise<void>

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
  return useFunc<{
    raw: RawEvent
  }>(
    () =>
      async ({ event, logger }) =>
        handler(event.raw.request, event.raw.response, logger)
  )
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
  return useFunc<{
    raw: RawEvent
  }>(() => async ({ event, logger }) => {
    for (const handler of handlers) {
      logger.debug('Middleware:', handler.name)

      if (event.raw.response.writableEnded) break

      await handler(event.raw.request, event.raw.response, logger)
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

    logger.debug('[static] finding:', request.url)

    const path = resolve(options.root, url)

    if (!existsSync(path)) {
      if (options.notFound) {
        logger.info('[static] not found:', url)

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

    logger.info('[static] found:', mimeType, url)

    await new Promise<void>((resolve, reject) => {
      stream
        .on('error', error => {
          logger.error('[static] error:', error)
          response.statusCode = 500
          response.end('Internal Server Error')
          reject(error)
        })
        .on('end', resolve)

      stream.pipe(response)
    })
  }
}
