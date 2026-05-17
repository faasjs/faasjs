/**
 * Error type that carries an HTTP status code for JSON error responses.
 *
 * @example
 * ```ts
 * import { HttpError, defineApi } from '@faasjs/core'
 *
 * export default defineApi({
 *   async handler() {
 *     throw new HttpError({
 *       statusCode: 403,
 *       message: 'Forbidden',
 *     })
 *   },
 * })
 * ```
 */
export class HttpError extends Error {
  /**
   * HTTP status code returned to the client.
   */
  public readonly statusCode: number
  /**
   * Error message exposed to callers.
   */
  public override readonly message: string

  /**
   * Create an HTTP error with a status code and user-facing message.
   *
   * @param {object} options - Error details.
   * @param {number} [options.statusCode] - HTTP status code returned to the client. Defaults to `500`.
   * @param {string} options.message - User-facing error message serialized in the response body.
   */
  constructor(options: { statusCode?: number; message: string }) {
    const { statusCode, message } = options

    super(message)

    if (Error.captureStackTrace) Error.captureStackTrace(this, HttpError)

    this.statusCode = statusCode || 500
    this.message = message
  }
}
