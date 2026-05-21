import type { Logger } from '@faasjs/node-utils'
import { deepMerge } from '@faasjs/utils'

import { type MountData, type InvokeData, type Next, type Plugin } from '../../func'
import { Cookie } from './cookie'
import { HttpError } from './http-error'
import { type HttpInvokeState, type HttpConfig, type Response, ContentType } from './types'

type RuntimeHttpConfig = NonNullable<HttpConfig['config']>

const Name = 'http'

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
        data.config.plugins[this.name || (this.type as string)].config ?? {},
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
    this.finalizeBody(data)
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

    if (state.params && typeof state.params === 'object')
      data.event.params = structuredClone(state.params)
    else data.event.params = state.params

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

  private finalizeBody(data: InvokeData): void {
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
  }
}
