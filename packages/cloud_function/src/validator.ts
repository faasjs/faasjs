import { Logger } from '@faasjs/logger'

export type ValidatorConfig = {
  whitelist?: 'error' | 'ignore'
  rules: {
    [key: string]: {
      type?: 'string' | 'number' | 'boolean' | 'object' | 'array'
      required?: boolean
      in?: any[]
      default?: any
      config?: Partial<ValidatorConfig>
    }
  }
  onError?: (
    type: string,
    key: string | string[],
    value?: any
  ) => {
    statusCode?: number
    headers?: {
      [name: string]: any
    }
    message: any
    // biome-ignore lint/suspicious/noConfusingVoidType: <explanation>
  } | void
}

export class Validator {
  public eventConfig?: ValidatorConfig
  private request?: {
    event?: any
  }

  private readonly logger: Logger

  constructor(config: {
    event?: ValidatorConfig
  }) {
    this.eventConfig = config.event
    this.logger = new Logger('CloudFunction.Validator')
  }

  public valid({
    event,
  }: {
    event?: any
  }): void {
    this.request = { event }
    this.logger.debug('Begin')

    if (this.eventConfig) {
      this.logger.debug('Valid event')
      this.validContent('event', event, '', this.eventConfig)
    }
  }

  public validContent(
    type: string,
    event: {
      [key: string]: any
    },
    baseKey: string,
    config: ValidatorConfig
  ): void {
    if (config.whitelist) {
      const eventKeys = Object.keys(event)
      const rulesKeys = Object.keys(config.rules).concat(['context'])
      const diff = eventKeys.filter(k => !rulesKeys.includes(k))
      if (diff.length > 0) {
        if (config.whitelist === 'error') {
          const diffKeys = diff.map(k => `${baseKey}${k}`)
          const error = Error(
            `[${type}] Not permitted keys: ${diffKeys.join(', ')}`
          )
          if (config.onError)
            config.onError(`${type}.whitelist`, baseKey, diffKeys)

          throw error
        }
        if (config.whitelist === 'ignore')
          for (const key of diff) delete event[key]
      }
    }
    for (const key in config.rules) {
      const rule = config.rules[key]
      let value = event[key]

      // default
      if (rule.default)
        if (type === 'cookie' || type === 'session')
          this.logger.warn('Cookie and Session not support default rule.')
        else if (typeof value === 'undefined' && rule.default) {
          value =
            typeof rule.default === 'function'
              ? rule.default(this.request)
              : rule.default
          event[key] = value
        }

      // required
      if (rule.required)
        if (typeof value === 'undefined' || value === null) {
          const error = Error(`[${type}] ${baseKey}${key} is required.`)
          if (config.onError)
            config.onError(`${type}.rule.required`, `${baseKey}${key}`, value)

          throw error
        }

      if (typeof value !== 'undefined' && value !== null) {
        // type
        if (rule.type)
          if (type === 'cookie')
            this.logger.warn('Cookie not support type rule')
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
              if (config.onError)
                config.onError(`${type}.rule.type`, `${baseKey}${key}`, value)

              throw error
            }
          }

        // in
        if (rule.in && !rule.in.includes(value)) {
          const error = Error(
            `[${type}] ${baseKey}${key} must be in ${rule.in.join(', ')}.`
          )
          if (config.onError)
            config.onError(`${type}.rule.in`, `${baseKey}${key}`, value)

          throw error
        }

        // nest config
        if (rule.config)
          if (type === 'cookie')
            this.logger.warn('Cookie not support nest rule.')
          else if (Array.isArray(value))
            // array
            for (const val of value)
              this.validContent(
                type,
                val,
                baseKey ? `${baseKey}.${key}.` : `${key}.`,
                rule.config as ValidatorConfig
              )
          else if (typeof value === 'object')
            // object
            this.validContent(
              type,
              value,
              baseKey ? `${baseKey}.${key}.` : `${key}.`,
              rule.config as ValidatorConfig
            )
      }
    }
  }
}
