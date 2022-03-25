import {
  Plugin, InvokeData, MountData, DeployData, Next, usePlugin, UseifyPlugin
} from '@faasjs/func'
import { deepMerge } from '@faasjs/deep_merge'
import { Logger } from '@faasjs/logger'
import { Cookie, CookieOptions } from './cookie'
import { Session, SessionOptions } from './session'
import {
  Validator, ValidatorOptions, ValidatorRuleOptions, ValidatorConfig
} from './validator'
import {
  gzipSync, deflateSync, brotliCompressSync
} from 'zlib'

export {
  Cookie, CookieOptions,
  Session, SessionOptions,
  Validator, ValidatorConfig, ValidatorOptions, ValidatorRuleOptions
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
  jsonp: 'application/javascript'
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
    method?: 'BEGIN' | 'GET' | 'POST' | 'DELETE' | 'HEAD' | 'PUT' | 'OPTIONS' | 'TRACE' | 'PATCH' | 'ANY'
    timeout?: number
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

  constructor ({
    statusCode,
    message
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

export class Http<TParams extends Record<string, any> = any,
  TCookie extends Record<string, string> = any,
  TSession extends Record<string, string> = any
> implements Plugin {
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
  private readonly validatorOptions?: ValidatorConfig<TParams, TCookie, TSession>
  private response?: Response
  private validator?: Validator<TParams, TCookie, TSession>
  private readonly logger: Logger

  /**
   * 创建 Http 插件实例
   * @param config {object} 配置项
   * @param config.name {string} 配置名
   * @param config.config {object} 网关配置
   * @param config.config.method {string} 请求方法，默认为 POST
   * @param config.config.path {string} 请求路径，默认为云函数文件路径
   * @param config.config.ignorePathPrefix {string} 排除的路径前缀，当设置 path 时无效
   * @param config.config.cookie {object} Cookie 配置
   * @param config.validator {object} 入参校验配置
   * @param config.validator.params {object} params 校验配置
   * @param config.validator.params.whitelist {string} 白名单配置
   * @param config.validator.params.onError {function} 自定义报错
   * @param config.validator.params.rules {object} 参数校验规则
   * @param config.validator.cookie {object} cookie 校验配置
   * @param config.validator.cookie.whitelist {string} 白名单配置
   * @param config.validator.cookie.onError {function} 自定义报错
   * @param config.validator.cookie.rules {object} 参数校验规则
   * @param config.validator.session {object} session 校验配置
   * @param config.validator.session.whitelist {string} 白名单配置
   * @param config.validator.session.onError {function} 自定义报错
   * @param config.validator.session.rules {object} 参数校验规则
   * @param config.validator.before {function} 参数校验前自定义函数
   */
  constructor (config?: HttpConfig<TParams, TCookie, TSession>) {
    this.name = config?.name || this.type
    this.config = ((config?.config)) || Object.create(null)
    if ((config?.validator)) this.validatorOptions = config.validator
    this.logger = new Logger(this.name)

    this.headers = Object.create(null)
    this.cookie = new Cookie(this.config.cookie || {})
    this.session = this.cookie.session
  }

  public async onDeploy (data: DeployData, next: Next): Promise<void> {
    data.dependencies['@faasjs/http'] = '*'

    await next()

    this.logger.debug('组装网关配置')
    this.logger.debug('%j', data)

    const config = data.config.plugins ?
      deepMerge(data.config.plugins[this.name || this.type], { config: this.config }) :
      { config: this.config }

    // 根据文件及文件夹名生成路径
    if (!config.config.path) {
      config.config.path = '/' + data.name?.replace(/_/g, '/').replace(/\/index$/, '')
      if (config.config.path === '/index') config.config.path = '/'
      if (config.config.ignorePathPrefix) {
        config.config.path = config.config.path.replace(new RegExp('^' + config.config.ignorePathPrefix), '')
        if (config.config.path === '') config.config.path = '/'
      }
    }

    this.logger.debug('组装完成 %j', config)

    // 引用服务商部署插件
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const Provider = require(config.provider.type).Provider
    const provider = new Provider(config.provider.config)

    // 部署网关
    await provider.deploy(this.type, data, config)
  }

  public async onMount (data: MountData, next: Next): Promise<void> {
    this.logger.debug('[onMount] merge config')
    if (data.config.plugins && data.config.plugins[this.name || this.type])
      this.config = deepMerge(this.config, data.config.plugins[this.name || this.type].config)

    this.logger.debug('[onMount] prepare cookie & session')
    this.cookie = new Cookie(this.config.cookie || {})
    this.session = this.cookie.session

    if (this.validatorOptions) {
      this.logger.debug('[onMount] prepare validator')
      this.validator = new Validator<TParams, TCookie, TSession>(this.validatorOptions, this.logger)
    }

    await next()
  }

  public async onInvoke (data: InvokeData, next: Next): Promise<void> {
    this.headers = data.event.headers || Object.create(null)
    this.body = data.event.body
    this.params = Object.create(null)
    this.response = { headers: Object.create(null) }

    if (data.event.body) {
      if (data.event.headers && data.event.headers['content-type'] && data.event.headers['content-type'].includes('application/json')) {
        this.logger.debug('[onInvoke] Parse params from json body')
        this.params = JSON.parse(data.event.body)
      } else {
        this.logger.debug('[onInvoke] Parse params from raw body')
        this.params = data.event.body
      }
      this.logger.debug('[onInvoke] Params: %j', this.params)
    } else if (data.event.queryString) {
      this.logger.debug('[onInvoke] Parse params from queryString')
      this.params = data.event.queryString
      this.logger.debug('[onInvoke] Params: %j', this.params)
    }

    this.cookie.invoke(this.headers.cookie)
    if (this.headers.cookie) {
      this.logger.debug('[onInvoke] Cookie: %j', this.cookie.content)
      this.logger.debug('[onInvoke] Session: %j', this.session.content)
    }

    if (this.validator) {
      this.logger.debug('[onInvoke] Valid request')
      try {
        await this.validator.valid({
          headers: this.headers,
          params: this.params,
          cookie: this.cookie,
          session: this.session
        })
      } catch (error: any) {
        this.logger.error(error)
        data.response = {
          statusCode: error.statusCode || 500,
          headers: { 'Content-Type': 'application/json; charset=utf-8' },
          body: JSON.stringify({ error: { message: error.message } })
        }
        return
      }
    }

    try {
      await next()
    } catch (error) {
      data.response = error
    }

    // update session
    this.session.update()

    // 处理 body
    if (data.response)
      if (data.response instanceof Error || data.response.constructor?.name === 'Error') {
        // 当结果是错误类型时
        this.logger.error(data.response)
        this.response.body = JSON.stringify({ error: { message: data.response.message } })
        try {
          this.response.statusCode = data.response.statusCode || 500
        } catch (error) {
          this.response.statusCode = 500
        }
      } else if (Object.prototype.toString.call(data.response) === '[object Object]' && data.response.statusCode && data.response.headers)
        // 当返回结果是响应结构体时
        this.response = data.response
      else
        this.response.body = JSON.stringify({ data: data.response })

    // 处理 statusCode
    if (!this.response.statusCode)
      this.response.statusCode = this.response.body ? 200 : 201

    // 处理 headers
    this.response.headers = Object.assign({
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-cache, no-store'
    }, this.cookie.headers(), this.response.headers)

    data.response = Object.assign(data.response, this.response)

    const originBody = data.response.body
    data.response.originBody = originBody

    if (process.env.FaasMode === 'local') {
      this.logger.debug('[onInvoke] Response: %j', data.response)
      return
    }

    // 判断是否需要压缩
    if (
      data.response.isBase64Encoded ||
      typeof data.response.body !== 'string' ||
      !data.response.headers['Content-Type']?.includes('json') ||
      data.response.body.length < 100
    ) return

    const acceptEncoding = this.headers['accept-encoding'] || this.headers['Accept-Encoding']
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
      // 若压缩失败还原
      data.response.body = originBody
      delete data.response.headers['Content-Encoding']
    }
  }

  /**
   * 设置 header
   * @param key {string} key
   * @param value {*} value
   */
  public setHeader (key: string, value: string): Http<TParams, TCookie, TSession> {
    this.response.headers[key] = value
    return this
  }

  /**
   * 设置 Content-Type
   * @param type {string} 类型
   * @param charset {string} 编码
   */
  public setContentType (type: string, charset: string = 'utf-8'): Http<TParams, TCookie, TSession> {
    if (ContentType[type]) this.setHeader('Content-Type', `${ContentType[type]}; charset=${charset}`); else this.setHeader('Content-Type', `${type}; charset=${charset}`)
    return this
  }

  /**
   * 设置状态码
   * @param code {number} 状态码
   */
  public setStatusCode (code: number): Http<TParams, TCookie, TSession> {
    this.response.statusCode = code
    return this
  }

  /**
   * 设置 body
   * @param body {*} 内容
   */
  public setBody (body: string): Http<TParams, TCookie, TSession> {
    this.response.body = body
    return this
  }
}

export function useHttp<TParams extends Record<string, any> = any,
  TCookie extends Record<string, string> = any,
  TSession extends Record<string, string> = any
> (
  config?: HttpConfig<TParams, TCookie, TSession>):
  Http<TParams, TCookie, TSession> & UseifyPlugin
{
  return usePlugin(new Http<TParams, TCookie, TSession>(config))
}
