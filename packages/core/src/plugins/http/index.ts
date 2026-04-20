import { createBrotliCompress, createDeflate, createGzip } from 'node:zlib'

import type { Logger } from '@faasjs/node-utils'
import { deepMerge } from '@faasjs/utils'

import { type MountData, type InvokeData, type Next, type Plugin } from '../../func'
import { Cookie, type CookieOptions } from './cookie'
import type { Session } from './session'

export { Cookie, type CookieOptions } from './cookie'

export { Session, type SessionContent, type SessionOptions } from './session'

/**
 * Common content type aliases used by the HTTP plugin.
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

type RuntimeHttpConfig = NonNullable<HttpConfig['config']>

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
 * @param {HttpResponseBody} body - Response body payload.
 * @returns {void} No return value.
 */
export type HttpSetBody = (body: HttpResponseBody) => void

type HttpInvokeState<
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

const Name = 'http'

function createCompressedStream(
  body: string,
  encoding: 'br' | 'gzip' | 'deflate',
): ReadableStream<Uint8Array> {
  const compressStream =
    encoding === 'br'
      ? createBrotliCompress()
      : encoding === 'gzip'
        ? createGzip()
        : createDeflate()

  return new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        const compressed = await new Promise<Buffer>((resolve, reject) => {
          const chunks: Buffer[] = []

          compressStream.on('data', (chunk: Buffer) => chunks.push(chunk))
          compressStream.on('end', () => resolve(Buffer.concat(chunks)))
          compressStream.on('error', reject)

          compressStream.write(Buffer.from(body))
          compressStream.end()
        })

        const chunkSize = 16 * 1024
        for (let i = 0; i < compressed.length; i += chunkSize) {
          controller.enqueue(compressed.subarray(i, i + chunkSize))
        }

        controller.close()
      } catch (error) {
        controller.error(error)
      }
    },
  })
}

/**
 * HTTP lifecycle plugin that enriches invoke data with cookies, sessions, and response helpers.
 *
 * @template TParams - Parsed HTTP params type injected into invoke data.
 * @template TCookie - Cookie map exposed by the cookie helper.
 * @template TSession - Session map exposed by the session helper.
 *
 * @example
 * ```ts
 * import { Http } from '@faasjs/core'
 *
 * const http = new Http({
 *   config: {
 *     cookie: {
 *       session: {
 *         key: 'session_id',
 *         secret: 'replace-me',
 *       },
 *     },
 *   },
 * })
 * ```
 */
export class Http<
  TParams extends Record<string, any> = any,
  TCookie extends Record<string, string> = any,
  TSession extends Record<string, string> = any,
> implements Plugin {
  /**
   * Stable plugin type identifier.
   */
  public readonly type = 'http'
  /**
   * Plugin instance name used in config lookup and logs.
   */
  public readonly name: string = Name

  /**
   * Active HTTP plugin configuration after mount-time merging.
   */
  public config: RuntimeHttpConfig
  private cookieTemplate!: Cookie<TCookie, TSession>

  /**
   * Create an HTTP plugin instance.
   *
   * @param {HttpConfig} [config] - Optional plugin name and HTTP configuration overrides.
   * @param {string} [config.name] - Instance name used to look up plugin config and label logs.
   * @param {HttpConfig['config']} [config.config] - Runtime HTTP behavior overrides merged during mount.
   * See {@link HttpConfig} for the nested `config` fields consumed by the current core runtime.
   */
  constructor(config?: HttpConfig) {
    this.name = config?.name || this.type
    this.config = config?.config || Object.create(null)
    this.mergeEnvConfig()
    this.refreshCookieTemplate()
  }

  private mergeEnvConfig(): void {
    const prefix = `SECRET_${this.name.toUpperCase()}_`

    for (let key in process.env)
      if (key.startsWith(prefix)) {
        const value = process.env[key]
        key = key.replace(prefix, '').toLowerCase()
        if (key.includes('_')) {
          let config: Record<string, any> = this.config
          const keys = key.split('_')
          for (const k of keys.slice(0, keys.length - 1)) {
            if (!config[k]) config[k] = Object.create(null)
            config = config[k]
          }
          config[keys[keys.length - 1] as string] = value
        } else (this.config as Record<string, any>)[key] = value
      }
  }

  private refreshCookieTemplate(logger?: Logger): void {
    this.cookieTemplate = new Cookie<TCookie, TSession>(this.config.cookie || {}, logger)
    this.config.cookie = {
      ...this.cookieTemplate.config,
      session: {
        ...this.cookieTemplate.session.config,
      },
    }
  }

  private createInvokeState(data: InvokeData): HttpInvokeState<TParams, TCookie, TSession> {
    const response: Response = { headers: Object.create(null) }
    const cookie = this.cookieTemplate.fork(data.logger)

    const state: HttpInvokeState<TParams, TCookie, TSession> = {
      headers: data.event.headers || Object.create(null),
      body: data.event.body,
      params: (data.event.queryString || Object.create(null)) as TParams,
      cookie,
      session: cookie.session,
      response,
      setHeader: (key, value) => {
        ;(response.headers || (response.headers = Object.create(null)))[key.toLowerCase()] = value
      },
      setContentType: (type, charset = 'utf-8') => {
        state.setHeader('Content-Type', `${ContentType[type] || type}; charset=${charset}`)
      },
      setStatusCode: (code) => {
        response.statusCode = code
      },
      setBody: (body) => {
        response.body = body
      },
    }

    return state
  }

  private attachInvokeData(
    data: InvokeData,
    state: HttpInvokeState<TParams, TCookie, TSession>,
  ): void {
    data.headers = state.headers
    data.body = state.body
    data.cookie = state.cookie
    data.session = state.session
    data.setHeader = state.setHeader
    data.setContentType = state.setContentType
    data.setStatusCode = state.setStatusCode
    data.setBody = state.setBody
  }

  /**
   * Merge environment and function config into the plugin before first invoke.
   *
   * Request-scoped logging is also available during mount through the runtime-injected `logger`.
   *
   * @param {MountData} data - Mount data supplied by the parent function.
   * @param {Record<string, any>} data.config - Resolved function configuration used to merge plugin settings.
   * @param {any} data.event - Initial event payload forwarded during mount.
   * @param {any} data.context - Initial runtime context forwarded during mount.
   * @param {Next} next - Continuation for the remaining mount chain.
   * @returns {Promise<void>} Promise that resolves after config merging completes.
   * @throws {Error} When function config is unavailable.
   */
  public async onMount(data: MountData, next: Next): Promise<void> {
    data.logger.debug('merge config')

    this.mergeEnvConfig()

    if (!data.config) throw Error(`[${this.name}] Config not found.`)

    if (data.config.plugins?.[this.name || this.type])
      this.config = deepMerge(
        this.config,
        data.config.plugins[this.name || (this.type as string)].config,
      )

    data.logger.debug('prepare cookie & session')
    this.refreshCookieTemplate(data.logger)

    await next()
  }

  /**
   * Attach HTTP helpers, cookies, sessions, and response handling to invoke data.
   *
   * The HTTP plugin also injects runtime helpers such as `headers`, `body`, `params`, `cookie`,
   * and `session` before invoking the next handler in the chain.
   *
   * @param {InvokeData} data - Invocation data for the current request.
   * @param {any} data.event - Raw request event payload before HTTP params are normalized.
   * @param {any} data.response - Mutable HTTP response object shared with the handler.
   * @param {Next} next - Continuation for the remaining invoke chain.
   * @returns {Promise<void>} Promise that resolves after response helpers are applied.
   */
  public async onInvoke(data: InvokeData, next: Next): Promise<void> {
    const state = this.createInvokeState(data)

    this.attachInvokeData(data, state)
    try {
      this.parseEventParams(data, state)
      data.params = data.event.params

      state.cookie.invoke(state.headers.cookie, data.logger)

      if (state.headers.cookie) {
        data.logger.debug('Cookie: %j', state.cookie.content)
        data.logger.debug('Session: %s %j', state.session.config.key, state.session.content)
      }

      await next()
    } catch (error) {
      data.response = error
    }

    state.session.update()
    this.buildResponse(data, state)
    this.finalizeBody(data, state)
  }

  private parseEventParams(
    data: InvokeData,
    state: HttpInvokeState<TParams, TCookie, TSession>,
  ): void {
    if (state.body) {
      const contentType = state.headers['content-type']

      if (
        contentType?.includes('application/json') &&
        typeof state.body === 'string' &&
        state.body.length > 1
      ) {
        data.logger.debug('Parse params from json body')
        try {
          state.params = Object.keys(state.params).length
            ? Object.assign(state.params, JSON.parse(state.body))
            : JSON.parse(state.body)
        } catch (error: any) {
          data.logger.error('Parse params from json body failed: %s', error.message)
          throw new HttpError({
            statusCode: 400,
            message: 'Invalid JSON request body',
          })
        }
      } else {
        data.logger.debug('Parse params from raw body')
        state.params = state.body || Object.create(null)
      }
    }

    if (state.params && typeof state.params === 'object' && state.params._)
      delete (state.params as Record<string, any>)._

    if (state.params && typeof state.params === 'object') {
      try {
        data.event.params = structuredClone(state.params)
      } catch {
        data.event.params = state.params
      }
    } else data.event.params = state.params

    data.logger.debug('Params: %j', state.params)
  }

  private buildResponse(
    data: InvokeData,
    state: HttpInvokeState<TParams, TCookie, TSession>,
  ): void {
    if (state.response.body && !data.response) data.response = state.response.body

    if (data.response)
      if (data.response instanceof Error || data.response.constructor?.name === 'Error') {
        data.logger.error(data.response)
        state.response.body = JSON.stringify({
          error: { message: data.response.message },
        })
        try {
          state.response.statusCode = data.response.statusCode || 500
        } catch (error: any) {
          data.logger.error(error)
          state.response.statusCode = 500
        }
      } else if (
        Object.prototype.toString.call(data.response) === '[object Object]' &&
        data.response.statusCode &&
        data.response.headers
      )
        state.response = data.response
      else if (data.response instanceof ReadableStream) state.response.body = data.response
      else
        state.response.body = JSON.stringify({
          data: data.response === undefined ? null : data.response,
        })

    if (!state.response.statusCode) state.response.statusCode = data.response ? 200 : 204

    state.response.headers = Object.assign(
      {
        'content-type':
          state.response.body instanceof ReadableStream
            ? 'text/plain; charset=utf-8'
            : 'application/json; charset=utf-8',
        'cache-control': 'no-cache, no-store',
        'x-faasjs-request-id': data.context.request_id,
      },
      state.cookie.headers(),
      state.response.headers,
    )

    data.response = Object.assign({}, data.response, state.response)
  }

  private finalizeBody(data: InvokeData, state: HttpInvokeState<TParams, TCookie, TSession>): void {
    const originBody = data.response.body
    data.response.originBody = originBody

    if (originBody instanceof ReadableStream) {
      data.response.isBase64Encoded = true
      return
    }

    if (originBody === undefined && data.response.statusCode === 204) return

    const normalizedBody =
      originBody === undefined
        ? JSON.stringify({ data: null })
        : typeof originBody === 'string'
          ? originBody
          : JSON.stringify(originBody)

    if (normalizedBody.length < 1024) {
      data.response.body = new ReadableStream<Uint8Array>({
        start(controller) {
          try {
            controller.enqueue(new TextEncoder().encode(normalizedBody))
            controller.close()
          } catch (error) {
            controller.error(error)
          }
        },
      })
      return
    }

    data.response.body = normalizedBody

    const acceptEncoding = state.headers['accept-encoding'] || state.headers['Accept-Encoding']
    if (!acceptEncoding || !/(br|gzip|deflate)/.test(acceptEncoding)) return

    const encoding: 'br' | 'gzip' | 'deflate' = acceptEncoding.includes('br')
      ? 'br'
      : acceptEncoding.includes('gzip')
        ? 'gzip'
        : 'deflate'

    data.response.headers['Content-Encoding'] = encoding

    try {
      data.response.body = createCompressedStream(normalizedBody, encoding)
    } catch (error) {
      data.logger.error('Compression failed: %s', (error as Error).message)
      data.response.body = normalizedBody
      delete data.response.headers['Content-Encoding']
    }
  }
}

declare module '@faasjs/core' {
  interface DefineApiInject {
    headers: Record<string, any>
    body: any
    setHeader: HttpSetHeader
    setContentType: HttpSetContentType
    setStatusCode: HttpSetStatusCode
    setBody: HttpSetBody
  }
}
