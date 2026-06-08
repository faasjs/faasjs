import type { Cookie } from './cookie'
import type { CookieOptions } from './cookie'
import type { Session } from './session'

/**
 * Common content type aliases used by the HTTP plugin.
 *
 * Built-in keys include `plain`, `html`, `xml`, `csv`, `css`, `javascript`,
 * `json`, and `jsonp`. {@link HttpSetContentType} also accepts raw MIME strings.
 *
 * @example
 * ```ts
 * const contentType = ContentType.json
 * ```
 */
export const ContentType: {
  [key: string]: string
} = {
  plain: 'text/plain',
  html: 'text/html',
  xml: 'application/xml',
  csv: 'text/csv',
  css: 'text/css',
  javascript: 'application/javascript',
  json: 'application/json',
  jsonp: 'application/javascript',
}

/**
 * Configuration for the {@link Http} plugin.
 *
 * @property {string} [name] - Instance name used when mounting multiple HTTP plugins.
 * @property {object} [config] - Runtime HTTP behavior overrides consumed by the current core runtime.
 */
export type HttpConfig = {
  /**
   * Instance name used to look up plugin-specific config.
   */
  name?: string
  /**
   * Runtime HTTP behavior overrides consumed by the current core runtime.
   */
  config?: {
    /**
     * Cookie and session configuration injected into invoke data.
     */
    cookie?: CookieOptions
  }
}

/**
 * Serializable HTTP response shape produced by FaasJS HTTP handlers.
 *
 * @property {number} [statusCode] - HTTP status code to send.
 * @property {Record<string, string>} [headers] - Response headers keyed by header name.
 * @property {string | ReadableStream} [body] - Plain string body or stream payload.
 * @property {string} [message] - Optional response message.
 */
export type Response = {
  statusCode?: number
  headers?: {
    [key: string]: string
  }
  body?: string | ReadableStream
  message?: string
}

/**
 * Non-undefined HTTP response body value.
 */
export type HttpResponseBody = Exclude<Response['body'], undefined>
/**
 * Set a response header by key.
 *
 * @param {string} key - Header name.
 * @param {string} value - Header value.
 * @returns {void} No return value.
 */
export type HttpSetHeader = (key: string, value: string) => void
/**
 * Set the response content type, optionally overriding the charset.
 *
 * @param {string} type - Content type alias or raw MIME type.
 * @param {string} [charset] - Optional charset appended to the content type.
 * @returns {void} No return value.
 */
export type HttpSetContentType = (type: string, charset?: string) => void
/**
 * Set the outgoing HTTP status code.
 *
 * @param {number} code - HTTP status code.
 * @returns {void} No return value.
 */
export type HttpSetStatusCode = (code: number) => void
/**
 * Set the outgoing HTTP body payload.
 *
 * @param {HttpResponseBody} body - Typed response body payload. Return plain values from handlers when you need JSON object wrapping.
 * @returns {void} No return value.
 */
export type HttpSetBody = (body: HttpResponseBody) => void

/**
 * Internal invoke state assembled by the HTTP plugin for each request.
 *
 * Holds parsed headers, body, params, cookie and session helpers, and mutable
 * response writers injected into the invoke data before the handler runs.
 *
 * @template TParams - Parsed HTTP params type.
 * @template TCookie - Cookie map exposed by the cookie helper.
 * @template TSession - Session map exposed by the session helper.
 */
export type HttpInvokeState<
  TParams extends Record<string, any>,
  TCookie extends Record<string, string>,
  TSession extends Record<string, string>,
> = {
  headers: Record<string, any>
  body: any
  params: TParams
  cookie: Cookie<TCookie, TSession>
  session: Session<TSession, TCookie>
  response: Response
  setHeader: HttpSetHeader
  setContentType: HttpSetContentType
  setStatusCode: HttpSetStatusCode
  setBody: HttpSetBody
}
