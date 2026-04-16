import { randomUUID } from 'node:crypto'
import type { IncomingMessage, ServerResponse } from 'node:http'

import { Logger } from '@faasjs/node-utils'

import { Func } from '../func'
import {
  getErrorMessage,
  getErrorStatusCode,
  respondWithInternalServerError,
  respondWithJsonError,
} from '../response-error'

/**
 * Event shape passed to middleware-backed functions.
 *
 * @property {any} body - Request body collected by the server.
 * @property {object} raw - Native request and response objects.
 * @property {IncomingMessage} raw.request - Native request object before FaasJS middleware adapts it.
 * @property {ServerResponse} raw.response - Native response writer for the current request.
 */
export type MiddlewareEvent = {
  body: any
  raw: {
    request: IncomingMessage
    response: ServerResponse
  }
}

/**
 * Context shared with middleware handlers.
 *
 * @property {Logger} logger - Middleware-scoped logger instance.
 * @property {string} root - Normalized project root provided by the server runtime.
 */
export type MiddlewareContext = {
  logger: Logger
  root: string
}

/**
 * Request middleware signature used by {@link useMiddleware} and {@link useMiddlewares}.
 *
 * @param {IncomingMessage} request - Native request object extended with the parsed body on `request.body`.
 * @param {ServerResponse} response - Native response writer.
 * @param {MiddlewareContext} context - Middleware-scoped utilities.
 * @returns {void | Promise<void>} Promise or void returned by the middleware.
 */
export type Middleware = (
  request: IncomingMessage & { body?: any },
  response: ServerResponse,
  context: MiddlewareContext,
) => void | Promise<void>

async function invokeMiddleware(
  event: MiddlewareEvent,
  context: Pick<MiddlewareContext, 'root'>,
  logger: Logger,
  handler: Middleware,
) {
  const loggerKey = randomUUID()
  const handlerLogger = new Logger(`${logger.label}] [middleware] [${handler.name || 'uname'}`)
  handlerLogger.debug('begin')
  handlerLogger.time(loggerKey, 'debug')
  try {
    await handler(Object.assign(event.raw.request, { body: event.body }), event.raw.response, {
      logger: handlerLogger,
      root: context.root,
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
 * Create a function that runs one middleware and falls back to `404 Not Found`.
 *
 * @param {Middleware} handler - Middleware to execute for each incoming request.
 * @returns {Promise<any>} Promise that resolves to a function wrapper.
 *
 * @example
 * ```ts
 * import { useMiddleware } from '@faasjs/core'
 *
 * export const func = useMiddleware((request, response, { logger }) => {
 *   response.setHeader('x-hello', 'World')
 *   response.end('Hello, World!')
 *   logger.info('Hello, World!')
 * })
 * ```
 */
export async function useMiddleware(
  handler: Middleware,
): Promise<Func<MiddlewareEvent, Pick<MiddlewareContext, 'root'>>> {
  return new Func<MiddlewareEvent, Pick<MiddlewareContext, 'root'>>({
    async handler({ event, context, logger }) {
      await invokeMiddleware(event, context, logger, handler)

      if (!event.raw.response.writableEnded) {
        event.raw.response.statusCode = 404
        event.raw.response.end('Not Found')
      }
    },
  })
}

/**
 * Create a function that runs middleware handlers in sequence until one ends the response.
 *
 * @param {Middleware[]} handlers - Middleware functions to run in order.
 * @returns {Promise<any>} Promise that resolves to a function wrapper.
 *
 * @example
 * ```ts
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
 *   },
 * ])
 * ```
 */
export async function useMiddlewares(
  handlers: Middleware[],
): Promise<Func<MiddlewareEvent, Pick<MiddlewareContext, 'root'>>> {
  return new Func<MiddlewareEvent, Pick<MiddlewareContext, 'root'>>({
    async handler({ event, context, logger }) {
      for (const handler of handlers) {
        if (event.raw.response.writableEnded) break

        await invokeMiddleware(event, context, logger, handler)
      }

      if (!event.raw.response.writableEnded) {
        event.raw.response.statusCode = 404
        event.raw.response.end('Not Found')
      }
    },
  })
}
