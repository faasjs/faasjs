import {
  Plugin,
  InvokeData,
  MountData,
  DeployData,
  Next,
  usePlugin,
  UseifyPlugin,
} from '@faasjs/func'
import { deepMerge } from '@faasjs/deep_merge'
import { Logger } from '@faasjs/logger'
import { Cookie, CookieOptions } from './cookie'
import { Session, SessionOptions } from './session'
import {
  Validator,
  ValidatorOptions,
  ValidatorRuleOptions,
  ValidatorConfig,
} from './validator'
import { gzipSync, deflateSync, brotliCompressSync } from 'zlib'

export {
  Cookie,
  CookieOptions,
  Session,
  SessionOptions,
  Validator,
  ValidatorConfig,
  ValidatorOptions,
  ValidatorRuleOptions,
}

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

export type HttpConfig<
  TParams extends Record<string, any> = any,
  TCookie extends Record<string, string> = any,
  TSession extends Record<string, string> = any
> = {
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
  validator?: ValidatorConfig<TParams, TCookie, TSession>
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
  public readonly message: string

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
  TSession extends Record<string, string> = any
> implements Plugin
{
  public readonly type: string = Name
  public readonly name: string = Name

  public headers: {
    [key: string]: string
  }
  public body: any

  public params: TParams
  public cookie: Cookie<TCookie, TSession>
  public session: Session<TSession, TCookie>
  public config: HttpConfig<TParams, TCookie, TSession>
  private readonly validatorOptions?: ValidatorConfig<
    TParams,
    TCookie,
    TSession
  >
  private response?: Response
  private validator?: Validator<TParams, TCookie, TSession>

  constructor(config?: HttpConfig<TParams, TCookie, TSession>) {
    this.name = config?.name || this.type
    this.config = config?.config || Object.create(null)
    if (config?.validator) this.validatorOptions = config.validator
  }

  public async onDeploy(data: DeployData, next: Next): Promise<void> {
    data.dependencies['@faasjs/http'] = '*'

    await next()

    const logger = new Logger(this.name)
    logger.debug("Generate api gateway's config")
    logger.debug('%j', data)

    const config = data.config.plugins
      ? deepMerge(data.config.plugins[this.name || this.type], {
          config: this.config,
        })
      : { config: this.config }

    // generate path from file path
    if (!config.config.path) {
      config.config.path = `/${data.name
        ?.replace(/_/g, '/')
        .replace(/\/index$/, '')}`
      if (config.config.path === '/index') config.config.path = '/'
      if (config.config.ignorePathPrefix) {
        config.config.path = config.config.path.replace(
          new RegExp(`^${config.config.ignorePathPrefix}`),
          ''
        )
        if (config.config.path === '') config.config.path = '/'
      }
    }

    logger.debug("Api gateway's config: %j", config)

    const Provider = require(config.provider.type).Provider
    const provider = new Provider(config.provider.config)

    await provider.deploy(this.type, data, config)
  }

  public async onMount(data: MountData, next: Next): Promise<void> {
    const logger = new Logger(data.logger?.label || this.name)

    if (!logger.label.endsWith(this.name))
      logger.label = `${logger.label}] [${this.name}`

    logger.debug('[onMount] merge config')

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
          config[keys[keys.length - 1]] = value
        } else this.config[key] = value
      }

    if (!data.config) throw Error(`[${this.name}] Config not found.`)

    if (data.config.plugins?.[this.name || this.type])
      this.config = deepMerge(
        this.config,
        data.config.plugins[this.name || this.type].config
      )

    logger.debug('[onMount] prepare cookie & session')
    this.cookie = new Cookie(this.config.cookie || {}, logger)
    this.session = this.cookie.session

    if (this.validatorOptions) {
      logger.debug('[onMount] prepare validator')
      this.validator = new Validator<TParams, TCookie, TSession>(
        this.validatorOptions
      )
    }

    await next()
  }

  public async onInvoke(data: InvokeData, next: Next): Promise<void> {
    const logger = new Logger(data.logger?.label || this.name)

    if (!logger.label?.endsWith(this.name))
      logger.label = `${logger.label}] [${this.name}`

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
        logger.debug('[onInvoke] Parse params from json body')
        try {
          this.params = Object.keys(this.params).length
            ? Object.assign(this.params, JSON.parse(data.event.body))
            : JSON.parse(data.event.body)
        } catch (error: any) {
          logger.error(
            '[onInvoke] Parse params from json body failed: %s',
            error.message
          )
        }
      } else {
        logger.debug('[onInvoke] Parse params from raw body')
        this.params = data.event.body || Object.create(null)
      }

      if (this.params && typeof this.params === 'object' && this.params._)
        delete (this.params as Record<string, any>)._

      data.event.params = deepClone(this.params)

      logger.debug('[onInvoke] Params: %j', this.params)
    }

    this.cookie.invoke(this.headers.cookie, logger)

    if (this.headers.cookie) {
      logger.debug('[onInvoke] Cookie: %j', this.cookie.content)
      logger.debug(
        '[onInvoke] Session: %s %j',
        this.session.config.key,
        this.session.content
      )
    }

    try {
      if (this.validator) {
        logger.debug('[onInvoke] Valid request')

        await this.validator.valid(
          {
            headers: this.headers,
            params: this.params,
            cookie: this.cookie,
            session: this.session,
          },
          logger
        )
      }
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
        logger.error(data.response)
        this.response.body = JSON.stringify({
          error: { message: data.response.message },
        })
        try {
          this.response.statusCode = data.response.statusCode || 500
        } catch (error) {
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
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-cache, no-store',
        'X-FaasJS-Request-Id': data.logger.label,
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
   * @param value {*} value
   */
  public setHeader(
    key: string,
    value: string
  ): Http<TParams, TCookie, TSession> {
    this.response.headers[key] = value
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
  TSession extends Record<string, string> = any
>(
  config?: HttpConfig<TParams, TCookie, TSession>
): UseifyPlugin<Http<TParams, TCookie, TSession>> {
  return usePlugin(new Http<TParams, TCookie, TSession>(config))
}
