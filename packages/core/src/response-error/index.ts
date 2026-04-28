import type { ServerResponse } from 'node:http'

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
