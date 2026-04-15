import type { IncomingMessage, ServerResponse } from 'node:http'

/**
 * Plain-text response body returned when an incoming request has no `url`.
 *
 * @example
 * ```ts
 * if (responseBody === BAD_REQUEST_URL_MESSAGE) {
 *   console.error('Request URL is missing')
 * }
 * ```
 */
export const BAD_REQUEST_URL_MESSAGE = 'Bad Request: url is undefined'

/**
 * Return the incoming request URL or finish the response with a `400` error when it is missing.
 *
 * @param {IncomingMessage} req - Incoming Node.js request.
 * @param {ServerResponse} res - Response used to send the fallback `400` error.
 * @returns {string | undefined} Request URL when available, otherwise `undefined`.
 * @example
 * ```ts
 * const requestUrl = ensureRequestUrl(req, res)
 *
 * if (!requestUrl) return
 * ```
 */
export function ensureRequestUrl(req: IncomingMessage, res: ServerResponse): string | undefined {
  if (req.url) return req.url

  res.statusCode = 400
  res.setHeader('Content-Type', 'text/plain; charset=utf-8')
  res.end(BAD_REQUEST_URL_MESSAGE)

  return undefined
}
