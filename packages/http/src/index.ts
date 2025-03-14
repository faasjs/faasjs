import { brotliCompressSync, deflateSync, gzipSync } from 'node:zlib'
import { deepMerge } from '@faasjs/deep_merge'
/**
 * FaasJS's http plugin.
 *
 * [![License: MIT](https://img.shields.io/npm/l/@faasjs/http.svg)](https://github.com/faasjs/faasjs/blob/main/packages/http/LICENSE)
 * [![NPM Version](https://img.shields.io/npm/v/@faasjs/http.svg)](https://www.npmjs.com/package/@faasjs/http)
 *
 * ## Install
 *
 * ```sh
 * npm install @faasjs/http
 * ```
 *
 * @packageDocumentation
 */
import {
  type InvokeData,
  type MountData,
  type Next,
  type Plugin,
  type UseifyPlugin,
  useFunc,
  usePlugin,
} from '@faasjs/func'
import { Cookie, type CookieOptions } from './cookie'
import type { Session } from './session'

export {
  Cookie,
  type CookieOptions,
} from './cookie'

export {
  Session,
  type SessionOptions,
} from './session'

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

export type HttpConfig = {
  [key: string]: any
  name?: string
  config?: {
    [key: string]: any
    /** POST as default */
    method?:
      | 'BEGIN'
      | 'GET'
      | 'POST'
      | 'DELETE'
      | 'HEAD'
      | 'PUT'
      | 'OPTIONS'
      | 'TRACE'
      | 'PATCH'
      | 'ANY'
    timeout?: number
    /** file relative path as default */
    path?: string
    ignorePathPrefix?: string
    functionName?: string
    cookie?: CookieOptions
  }
}

export type Response = {
  statusCode?: number
  headers?: {
    [key: string]: string
  }
  body?: string
  message?: string
}

export class HttpError extends Error {
  public readonly statusCode: number
  public override readonly message: string

  constructor({
    statusCode,
    message,
  }: {
    statusCode?: number
    message: string
  }) {
    super(message)

    if (Error.captureStackTrace) Error.captureStackTrace(this, HttpError)

    this.statusCode = statusCode || 500
    this.message = message
  }
}

const Name = 'http'

function deepClone(obj: Record<string, any>) {
  if (obj === null || typeof obj !== 'object') return obj

  if (Array.isArray(obj)) return JSON.parse(JSON.stringify(obj))

  const clone: Record<string, any> = {}

  for (const key in obj) {
    // biome-ignore lint/suspicious/noPrototypeBuiltins: <explanation>
    if (!obj.hasOwnProperty(key)) continue

    if (typeof obj[key] === 'function') {
      clone[key] = obj[key]
      continue
    }

    clone[key] = deepClone(obj[key])
  }

  return clone
}

export class Http<
  TParams extends Record<string, any> = any,
  TCookie extends Record<string, string> = any,
  TSession extends Record<string, string> = any,
> implements Plugin
{
  public readonly type = 'http'
  public readonly name: string = Name

  public headers: {
    [key: string]: string
  } = Object.create(null)
  public body: any

  public params: TParams = Object.create(null)
  public cookie: Cookie<TCookie, TSession>
  public session: Session<TSession, TCookie>
  public config: HttpConfig
  private response: Response

  constructor(config?: HttpConfig) {
    this.name = config?.name || this.type
    this.config = config?.config || Object.create(null)
  }

  public async onMount(data: MountData, next: Next): Promise<void> {
    data.logger.debug('merge config')

    const prefix = `SECRET_${this.name.toUpperCase()}_`

    for (let key in process.env)
      if (key.startsWith(prefix)) {
        const value = process.env[key]
        key = key.replace(prefix, '').toLowerCase()
        if (key.includes('_')) {
          let config = this.config
          const keys = key.split('_')
          for (const k of keys.slice(0, keys.length - 1)) {
            if (!config[k]) config[k] = Object.create(null)
            config = config[k]
          }
          config[keys[keys.length - 1] as string] = value
        } else this.config[key] = value
      }

    if (!data.config) throw Error(`[${this.name}] Config not found.`)

    if (data.config.plugins?.[this.name || this.type])
      this.config = deepMerge(
        this.config,
        data.config.plugins[this.name || (this.type as string)].config
      )

    data.logger.debug('prepare cookie & session')
    this.cookie = new Cookie(this.config.cookie || {}, data.logger)
    this.session = this.cookie.session

    await next()
  }

  public async onInvoke(data: InvokeData, next: Next): Promise<void> {
    this.headers = data.event.headers || Object.create(null)
    this.body = data.event.body
    this.params = data.event.queryString || Object.create(null)
    this.response = { headers: Object.create(null) }

    if (data.event.body) {
      if (
        this.headers['content-type']?.includes('application/json') &&
        typeof data.event.body === 'string' &&
        data.event.body.length > 1
      ) {
        data.logger.debug('Parse params from json body')
        try {
          this.params = Object.keys(this.params).length
            ? Object.assign(this.params, JSON.parse(data.event.body))
            : JSON.parse(data.event.body)
        } catch (error: any) {
          data.logger.error(
            'Parse params from json body failed: %s',
            error.message
          )
        }
      } else {
        data.logger.debug('Parse params from raw body')
        this.params = data.event.body || Object.create(null)
      }

      if (this.params && typeof this.params === 'object' && this.params._)
        delete (this.params as Record<string, any>)._

      data.event.params = deepClone(this.params)

      data.logger.debug('Params: %j', this.params)
    }

    data.params = data.event.params

    this.cookie.invoke(this.headers.cookie, data.logger)

    if (this.headers.cookie) {
      data.logger.debug('Cookie: %j', this.cookie.content)
      data.logger.debug(
        'Session: %s %j',
        this.session.config.key,
        this.session.content
      )
    }

    data.cookie = this.cookie
    data.session = this.session

    try {
      await next()
    } catch (error) {
      data.response = error
    }

    // update session
    this.session.update()

    // generate body
    if (data.response)
      if (
        data.response instanceof Error ||
        data.response.constructor?.name === 'Error'
      ) {
        // generate error response
        data.logger.error(data.response)
        this.response.body = JSON.stringify({
          error: { message: data.response.message },
        })
        try {
          this.response.statusCode = data.response.statusCode || 500
        } catch (e: any) {
          data.logger.error(e)
          this.response.statusCode = 500
        }
      } else if (
        Object.prototype.toString.call(data.response) === '[object Object]' &&
        data.response.statusCode &&
        data.response.headers
      )
        // for directly response
        this.response = data.response
      else this.response.body = JSON.stringify({ data: data.response })

    // generate statusCode
    if (!this.response.statusCode)
      this.response.statusCode = this.response.body ? 200 : 201

    // generate headers
    this.response.headers = Object.assign(
      {
        'content-type': 'application/json; charset=utf-8',
        'cache-control': 'no-cache, no-store',
        'x-faasjs-request-id': data.context.request_id,
      },
      this.cookie.headers(),
      this.response.headers
    )

    data.response = Object.assign({}, data.response, this.response)

    const originBody = data.response.body
    data.response.originBody = originBody

    // convert response body to string
    if (
      originBody &&
      !data.response.isBase64Encoded &&
      typeof originBody !== 'string'
    )
      data.response.body = JSON.stringify(originBody)

    // determine if the body needs to be compressed
    if (
      !data.response.body ||
      data.response.isBase64Encoded ||
      typeof data.response.body !== 'string' ||
      data.response.body.length < 1024
    )
      return

    const acceptEncoding =
      this.headers['accept-encoding'] || this.headers['Accept-Encoding']
    if (!acceptEncoding || !/(br|gzip|deflate)/.test(acceptEncoding)) return

    try {
      if (acceptEncoding.includes('br')) {
        data.response.headers['Content-Encoding'] = 'br'
        data.response.body = brotliCompressSync(originBody).toString('base64')
      } else if (acceptEncoding.includes('gzip')) {
        data.response.headers['Content-Encoding'] = 'gzip'
        data.response.body = gzipSync(originBody).toString('base64')
      } else if (acceptEncoding.includes('deflate')) {
        data.response.headers['Content-Encoding'] = 'deflate'
        data.response.body = deflateSync(originBody).toString('base64')
      } else throw Error('No matched compression.')

      data.response.isBase64Encoded = true
    } catch (error) {
      console.error(error)
      // restore the original body
      data.response.body = originBody
      delete data.response.headers['Content-Encoding']
    }
  }

  /**
   * set header
   * @param key {string} key
   * @param value {string} value
   */
  public setHeader(
    key: string,
    value: string
  ): Http<TParams, TCookie, TSession> {
    this.response.headers[key.toLowerCase()] = value
    return this
  }

  /**
   * set Content-Type
   * @param type {string} 类型
   * @param charset {string} 编码
   */
  public setContentType(
    type: string,
    charset = 'utf-8'
  ): Http<TParams, TCookie, TSession> {
    if (ContentType[type])
      this.setHeader('Content-Type', `${ContentType[type]}; charset=${charset}`)
    else this.setHeader('Content-Type', `${type}; charset=${charset}`)
    return this
  }

  /**
   * set status code
   * @param code {number} 状态码
   */
  public setStatusCode(code: number): Http<TParams, TCookie, TSession> {
    this.response.statusCode = code
    return this
  }

  /**
   * set body
   * @param body {*} 内容
   */
  public setBody(body: string): Http<TParams, TCookie, TSession> {
    this.response.body = body
    return this
  }
}

export function useHttp<
  TParams extends Record<string, any> = any,
  TCookie extends Record<string, string> = any,
  TSession extends Record<string, string> = any,
>(config?: HttpConfig): UseifyPlugin<Http<TParams, TCookie, TSession>> {
  return usePlugin(new Http<TParams, TCookie, TSession>(config))
}

export type HttpFuncHandler<
  TParams extends Record<string, any> = Record<string, any>,
  TCookie extends Record<string, string> = Record<string, string>,
  TSession extends Record<string, any> = Record<string, any>,
  TResult = any,
> = (
  data: InvokeData<{
    [key: string]: any
    params?: TParams
  }> & {
    params?: TParams
    cookie?: Cookie<TCookie, TSession>
    session?: Session<TSession, TCookie>
  }
) => Promise<TResult>

/**
 * A hook to create an HTTP function with specified handler and configuration.
 *
 * @template TParams - The type of the parameters object.
 * @template TCookie - The type of the cookies object.
 * @template TSession - The type of the session object.
 * @template TResult - The type of the result.
 *
 * @param {() => HttpFuncHandler<TParams, TCookie, TSession, TResult>} handler - The function handler to be used.
 * @param {Object} [config] - Optional configuration object.
 * @param {HttpConfig} [config.http] - Optional HTTP configuration.
 *
 * @returns {Function} The created HTTP function.
 */
export function useHttpFunc<
  TParams extends Record<string, any> = Record<string, any>,
  TCookie extends Record<string, string> = Record<string, string>,
  TSession extends Record<string, any> = Record<string, any>,
  TResult = any,
>(
  handler: () => HttpFuncHandler<TParams, TCookie, TSession, TResult>,
  config?: {
    http?: HttpConfig
  }
) {
  const func = useFunc(() => {
    useHttp(config?.http)

    return handler()
  })

  return func
}
