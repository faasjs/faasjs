import { randomUUID } from 'node:crypto'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { useFunc } from '@faasjs/func'
import { Logger } from '@faasjs/node-utils'
import {
  getErrorMessage,
  getErrorStatusCode,
  respondWithInternalServerError,
  respondWithJsonError,
} from '../response-error'

export type MiddlewareEvent = {
  body: any
  raw: {
    request: IncomingMessage
    response: ServerResponse
  }
}

export type MiddlewareContext = {
  logger: Logger
}

export type Middleware = (
  request: IncomingMessage & { body?: any },
  response: ServerResponse,
  context: MiddlewareContext,
) => void | Promise<void>

async function invokeMiddleware(event: MiddlewareEvent, logger: Logger, handler: Middleware) {
  const loggerKey = randomUUID()
  const handlerLogger = new Logger(`${logger.label}] [middleware] [${handler.name || 'uname'}`)
  handlerLogger.debug('begin')
  handlerLogger.time(loggerKey, 'debug')
  try {
    await handler(Object.assign(event.raw.request, { body: event.body }), event.raw.response, {
      logger: handlerLogger,
    })
  } catch (error) {
    handlerLogger.error('error:', error)

    const statusCode = getErrorStatusCode(error)
    if (statusCode === 500) respondWithJsonError(event.raw.response, 500, getErrorMessage(error))
    else respondWithInternalServerError(event.raw.response)
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
 * import { useMiddleware } from '@faasjs/core'
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
 * import { useMiddlewares } from '@faasjs/core'
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
