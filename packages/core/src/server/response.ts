import type { IncomingMessage, ServerResponse } from 'node:http'
import { Readable } from 'node:stream'

import type { Logger } from '@faasjs/node-utils'

import { buildCORSHeaders } from './headers'

/**
 * Default plain-text message used for generic internal server errors.
 *
 * @example
 * ```ts
 * res.end(INTERNAL_SERVER_ERROR_MESSAGE)
 * ```
 */
export const INTERNAL_SERVER_ERROR_MESSAGE = 'Internal Server Error'

type ErrorWithStatusCode = {
  statusCode?: unknown
  message?: unknown
}

/**
 * Read a numeric `statusCode` field from an unknown error-like value.
 *
 * @param {unknown} error - Error-like value to inspect.
 * @returns {number | undefined} Finite status code when present, otherwise `undefined`.
 * @example
 * ```ts
 * const statusCode = getErrorStatusCode({ statusCode: 418 })
 * ```
 */
export function getErrorStatusCode(error: unknown): number | undefined {
  if (!error || typeof error !== 'object') return undefined

  const statusCode = (error as ErrorWithStatusCode).statusCode
  if (typeof statusCode !== 'number' || !Number.isFinite(statusCode)) return undefined

  return statusCode
}

/**
 * Resolve a user-facing error message from an unknown error-like value.
 *
 * @param {unknown} error - Error-like value to inspect.
 * @param {string} [fallback] - Message returned when the error does not expose a usable string message.
 * @returns {string} Error message safe to send back to callers.
 * @example
 * ```ts
 * const message = getErrorMessage(error, 'Unexpected failure')
 * ```
 */
export function getErrorMessage(error: unknown, fallback = INTERNAL_SERVER_ERROR_MESSAGE): string {
  if (error && typeof error === 'object') {
    const message = (error as ErrorWithStatusCode).message
    if (typeof message === 'string' && message.length) return message
  }

  return fallback
}

/**
 * Send a JSON error response when the response has not already been finalized.
 *
 * @param {ServerResponse} res - Response that should receive the JSON error payload.
 * @param {number} statusCode - HTTP status code to send.
 * @param {string} message - Error message serialized under `error.message`.
 * @returns {void} No return value.
 * @example
 * ```ts
 * respondWithJsonError(res, 400, 'Bad Request')
 * ```
 */
export function respondWithJsonError(
  res: ServerResponse,
  statusCode: number,
  message: string,
): void {
  if (res.writableEnded) return

  if (res.headersSent) {
    res.end()
    return
  }

  res.statusCode = statusCode
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.end(
    JSON.stringify({
      error: {
        message,
      },
    }),
  )
}

/**
 * Send the default `500 Internal Server Error` plain-text response when possible.
 *
 * @param {ServerResponse} res - Response that should receive the fallback `500` body.
 * @returns {void} No return value.
 * @example
 * ```ts
 * respondWithInternalServerError(res)
 * ```
 */
export function respondWithInternalServerError(res: ServerResponse): void {
  if (res.writableEnded) return

  if (res.headersSent) {
    res.end()
    return
  }

  res.statusCode = 500
  res.setHeader('Content-Type', 'text/plain; charset=utf-8')
  res.end(INTERNAL_SERVER_ERROR_MESSAGE)
}

/**
 * Build response headers including CORS and timing information.
 *
 * @param {IncomingMessage} req - Incoming HTTP request.
 * @param {string} requestId - Unique request identifier.
 * @param {number} requestedAt - Timestamp when the request was received.
 * @param {number} startedAt - Timestamp when request processing started.
 * @param {any} data - Response data object that may contain custom headers.
 * @returns {Record<string, string>} Frozen headers object.
 */
export function buildResponseHeaders(
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

/**
 * Pipe a Node.js Readable stream to the response and handle completion or errors.
 *
 * @param {Readable} stream - Readable stream to pipe.
 * @param {ServerResponse} res - Target response.
 * @param {() => void} done - Callback invoked when piping finishes.
 * @param {(error: any) => void} onError - Callback invoked on stream errors.
 */
export function pipeToResponse(
  stream: Readable,
  res: ServerResponse<IncomingMessage>,
  done: () => void,
  onError: (error: any) => void,
): void {
  stream
    .pipe(res)
    .on('finish', () => {
      res.end()
      done()
    })
    .on('error', (err) => {
      onError(err)
      respondWithInternalServerError(res)
      done()
    })
}

/**
 * Attempt to write streaming response data to the HTTP response.
 *
 * @param {any} data - Response data that may contain a stream body.
 * @param {ServerResponse} res - Target response.
 * @param {Logger} logger - Request-scoped logger.
 * @param {(error: any) => void} onError - Callback invoked on stream errors.
 * @returns {Promise<boolean>} `true` when the data was streamed, `false` if it should be handled by other responders.
 */
export async function respondWithStreamData(
  data: any,
  res: ServerResponse<IncomingMessage>,
  logger: Logger,
  onError: (error: any) => void,
): Promise<boolean> {
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
        pipeToResponse(stream, res, done, onError)
      })

      return true
    }

    res.end()
    return true
  }

  if (data.body instanceof ReadableStream) {
    if (typeof data.statusCode === 'number') res.statusCode = data.statusCode

    await new Promise<void>((done) => {
      pipeToResponse(Readable.fromWeb(data.body), res, done, onError)
    })

    return true
  }

  return false
}

/**
 * Write a non-stream response (including errors) to the HTTP response.
 *
 * @param {any} data - Response data or error.
 * @param {ServerResponse} res - Target response.
 * @param {number | undefined} statusCode - Explicit status code to use.
 * @param {Logger} [logger] - Optional logger for response debugging.
 */
export function respondWithError(
  data: any,
  res: ServerResponse<IncomingMessage>,
  statusCode: number | undefined,
  logger?: Logger,
): void {
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

  let resBody: string | Buffer | undefined
  if (data.body) resBody = data.body

  if (typeof resBody !== 'undefined') {
    logger?.debug('Response %s %j', res.statusCode, res.getHeaders())
    res.write(resBody)
  }

  res.end()
}

/**
 * Write a complete HTTP response to the client.
 *
 * This is the single entry point for writing responses after the function lifecycle
 * has produced a result. It handles headers, streaming, errors, and plain responses.
 *
 * @param {any} data - Response data produced by the function lifecycle.
 * @param {IncomingMessage} req - Incoming HTTP request.
 * @param {ServerResponse} res - Target response.
 * @param {object} options - Response options.
 * @param {string} options.requestId - Unique request identifier.
 * @param {number} options.requestedAt - Timestamp when the request was received.
 * @param {number} options.startedAt - Timestamp when processing started.
 * @param {Logger} options.logger - Request-scoped logger.
 * @param {(error: any) => void} options.onError - Callback invoked on errors.
 * @returns {Promise<void>} Promise that resolves when the response has been written.
 */
export async function respond(
  data: any,
  req: IncomingMessage,
  res: ServerResponse<IncomingMessage>,
  options: {
    requestId: string
    requestedAt: number
    startedAt: number
    logger: Logger
    onError: (error: any) => void
  },
): Promise<void> {
  const headers = buildResponseHeaders(
    req,
    options.requestId,
    options.requestedAt,
    options.startedAt,
    data,
  )
  for (const key in headers) res.setHeader(key, headers[key] as string)

  if (await respondWithStreamData(data, res, options.logger, options.onError)) return

  const statusCode = getErrorStatusCode(data)

  if (statusCode === 500) {
    respondWithJsonError(res, 500, getErrorMessage(data))
    return
  }

  respondWithError(data, res, statusCode, options.logger)
}
