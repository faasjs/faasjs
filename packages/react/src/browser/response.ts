import type { ResponseProps, ResponseHeaders, ResponseErrorProps } from './types'

/**
 * Wrapper class for HTTP responses from FaasJS functions.
 *
 * Provides a consistent interface for handling server responses with status code, headers,
 * body, and parsed data. Automatically handles JSON serialization and status code defaults.
 *
 * @template T - The type of the data property for type-safe response handling
 */
export class Response<T = any> {
  /**
   * HTTP status code exposed to callers.
   */
  public readonly status: number
  /**
   * Response headers keyed by header name.
   */
  public readonly headers: ResponseHeaders
  /**
   * Raw response body.
   */
  public readonly body: any
  /**
   * Parsed response payload when JSON data is available.
   */
  public readonly data?: T

  /**
   * Create a wrapped response object.
   */
  constructor(props: ResponseProps<T> = {}) {
    this.status = props.status || (props.data || props.body ? 200 : 204)
    this.headers = props.headers || {}
    this.body = props.body
    if (props.data !== undefined) this.data = props.data

    if (props.data && !props.body) this.body = JSON.stringify(props.data)
  }
}

/**
 * Custom error class for handling HTTP response errors from FaasJS requests.
 *
 * Extends the built-in Error class to provide additional information about failed requests,
 * including HTTP status code, response headers, response body, and the original error.
 */
export class ResponseError extends Error {
  /**
   * HTTP status code reported for the failed request.
   */
  public readonly status: number
  /**
   * Response headers returned with the error.
   */
  public readonly headers: ResponseHeaders
  /**
   * Raw error body or fallback error payload.
   */
  public readonly body: any
  /**
   * Original error used to construct this instance, when available.
   */
  public readonly originalError?: Error

  /**
   * Create a ResponseError from a message, Error, or structured response error payload.
   */
  constructor(data: string | Error, options?: Omit<ResponseErrorProps, 'message' | 'originalError'>)
  constructor(data: ResponseErrorProps)
  constructor(
    data: string | Error | ResponseErrorProps,
    options?: Omit<ResponseErrorProps, 'message' | 'originalError'>,
  ) {
    let props: ResponseErrorProps
    if (typeof data === 'string') {
      props = { message: data, ...options }
    } else if (
      data instanceof Error ||
      (typeof data === 'object' &&
        data !== null &&
        typeof data.constructor?.name === 'string' &&
        data.constructor.name.includes('Error'))
    ) {
      props = {
        message: data.message,
        originalError: data as Error,
        ...options,
      }
    } else {
      props = data
    }

    super(props.message)

    this.status = props.status || 500
    this.headers = props.headers || {}
    this.body = props.body || props.originalError || { error: { message: props.message } }
    if (props.originalError) this.originalError = props.originalError
  }
}
