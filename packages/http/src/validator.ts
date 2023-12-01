import { Cookie } from './cookie'
import { Session } from './session'
import { Logger } from '@faasjs/logger'
import { HttpError } from '.'

export type ValidatorRuleOptionsType =
  | 'string'
  | 'number'
  | 'boolean'
  | 'object'
  | 'array'

export type ValidatorRuleOptions = {
  type?: ValidatorRuleOptionsType
  required?: boolean
  in?: any[]
  default?: any
  config?: Partial<ValidatorOptions>
  regexp?: RegExp
}

export type ValidatorOptions<Content = Record<string, any>> = {
  whitelist?: 'error' | 'ignore'
  rules: {
    [k in keyof Content]?: ValidatorRuleOptions
  }
  onError?: (
    type: string,
    key: string | string[],
    value?: any
  ) => {
    statusCode?: number
    message: any
    // biome-ignore lint/suspicious/noConfusingVoidType: <explanation>
  } | void
}

type Request<
  TParams extends Record<string, any> = any,
  TCookie extends Record<string, string> = any,
  TSession extends Record<string, string> = any,
> = {
  headers: {
    [key: string]: string
  }
  params?: TParams
  cookie?: Cookie<TCookie, TSession>
  session?: Session<TSession, TCookie>
}

export type BeforeOption<
  TParams extends Record<string, any> = any,
  TCookie extends Record<string, string> = any,
  TSession extends Record<string, string> = any,
  // biome-ignore lint/suspicious/noConfusingVoidType: <explanation>
> = (request: Request<TParams, TCookie, TSession>) => Promise<void | {
  statusCode?: number
  message: string
}>

export type ValidatorConfig<
  TParams extends Record<string, any> = any,
  TCookie extends Record<string, string> = any,
  TSession extends Record<string, string> = any,
> = {
  params?: ValidatorOptions<TParams>
  cookie?: ValidatorOptions<TCookie>
  session?: ValidatorOptions<TSession>
  before?: BeforeOption
}

export class Validator<
  TParams extends Record<string, any> = any,
  TCookie extends Record<string, string> = any,
  TSession extends Record<string, string> = any,
> {
  public before?: BeforeOption<TParams, TCookie, TSession>
  public paramsConfig?: ValidatorOptions<TParams>
  public cookieConfig?: ValidatorOptions<TCookie>
  public sessionConfig?: ValidatorOptions<TSession>
  private request: Request<TParams, TCookie, TSession>

  constructor(config: ValidatorConfig<TParams, TCookie, TSession>) {
    this.paramsConfig = config.params
    this.cookieConfig = config.cookie
    this.sessionConfig = config.session
    this.before = config.before
  }

  public async valid(
    request: Request<TParams, TCookie, TSession>,
    logger: Logger
  ): Promise<void> {
    if (this.before) {
      const result = await this.before(request)

      if (result) throw new HttpError(result)
    }

    this.request = request

    if (this.paramsConfig && request.params) {
      logger.debug('Valid Params')
      this.validContent('params', request.params, '', this.paramsConfig, logger)
    }

    if (this.cookieConfig && request.cookie) {
      logger.debug('Valid Cookie')
      if (request.cookie == null) throw Error('Not found Cookie')

      this.validContent(
        'cookie',
        request.cookie.content,
        '',
        this.cookieConfig,
        logger
      )
    }

    if (this.sessionConfig && request.session) {
      logger.debug('Valid Session')
      if (request.session == null) throw Error('Not found Session')
      this.validContent(
        'session',
        request.session.content,
        '',
        this.sessionConfig,
        logger
      )
    }
  }

  public validContent(
    type: string,
    params: {
      [key: string]: any
    },
    baseKey: string,
    config: ValidatorOptions,
    logger: Logger
  ): void {
    if (config.whitelist) {
      const paramsKeys = Object.keys(params)
      const rulesKeys = Object.keys(config.rules)
      const diff = paramsKeys.filter(k => !rulesKeys.includes(k))
      if (diff.length > 0) {
        if (config.whitelist === 'error') {
          const diffKeys = diff.map(k => `${baseKey}${k}`)
          const error = Error(
            `[${type}] Not permitted keys: ${diffKeys.join(', ')}`
          )
          if (config.onError) {
            const res = config.onError(`${type}.whitelist`, baseKey, diffKeys)
            if (res) throw new HttpError(res)
          }
          throw error
        }
        if (config.whitelist === 'ignore')
          for (const key of diff) delete params[key]
      }
    }
    for (const key in config.rules) {
      const rule = config.rules[key]

      if (!rule) continue

      let value = params[key]

      // default
      if (rule.default)
        if (type === 'cookie' || type === 'session')
          logger.warn('Cookie and Session not support default rule.')
        else if (typeof value === 'undefined' && rule.default) {
          value =
            typeof rule.default === 'function'
              ? rule.default(this.request)
              : rule.default
          params[key] = value
        }

      // required
      if (rule.required)
        if (typeof value === 'undefined' || value === null) {
          const error = Error(`[${type}] ${baseKey}${key} is required.`)
          if (config.onError) {
            const res = config.onError(
              `${type}.rule.required`,
              `${baseKey}${key}`,
              value
            )
            if (res) throw new HttpError(res)
          }
          throw error
        }

      if (typeof value !== 'undefined' && value !== null) {
        // type
        if (rule.type)
          if (type === 'cookie') logger.warn('Cookie not support type rule')
          else {
            let typed = true
            switch (rule.type) {
              case 'array':
                typed = Array.isArray(value)
                break
              case 'object':
                typed =
                  Object.prototype.toString.call(value) === '[object Object]'
                break
              default:
                // biome-ignore lint/suspicious/useValidTypeof: <explanation>
                typed = typeof value === rule.type
                break
            }

            if (!typed) {
              const error = Error(
                `[${type}] ${baseKey}${key} must be a ${rule.type}.`
              )
              if (config.onError) {
                const res = config.onError(
                  `${type}.rule.type`,
                  `${baseKey}${key}`,
                  value
                )
                if (res) throw new HttpError(res)
              }
              throw error
            }
          }

        // regexp
        if (
          rule.regexp &&
          (rule.type === 'string' || !rule.type) &&
          !rule.regexp.test(value)
        ) {
          const error = Error(
            `[${type}] ${baseKey}${key} must match ${rule.regexp}.`
          )
          if (config.onError) {
            const res = config.onError(
              `${type}.rule.regexp`,
              `${baseKey}${key}`,
              value
            )
            if (res) throw new HttpError(res)
          }
          throw error
        }
        // in
        if (rule.in && !rule.in.includes(value)) {
          const error = Error(
            `[${type}] ${baseKey}${key} must be in ${rule.in.join(', ')}.`
          )
          if (config.onError) {
            const res = config.onError(
              `${type}.rule.in`,
              `${baseKey}${key}`,
              value
            )
            if (res) throw new HttpError(res)
          }
          throw error
        }

        // nest config
        if (rule.config)
          if (type === 'cookie') logger.warn('Cookie not support nest rule.')
          else if (Array.isArray(value))
            // array

            for (const val of value)
              this.validContent(
                type,
                val,
                baseKey ? `${baseKey}.${key}.` : `${key}.`,
                rule.config as ValidatorOptions,
                logger
              )
          else if (typeof value === 'object')
            // object
            this.validContent(
              type,
              value,
              baseKey ? `${baseKey}.${key}.` : `${key}.`,
              rule.config as ValidatorOptions,
              logger
            )
      }
    }
  }
}
