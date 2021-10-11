import {
  Plugin, MountData, Next, usePlugin, UseifyPlugin
} from '@faasjs/func'
import { Logger } from '@faasjs/logger'
import { deepMerge } from '@faasjs/deep_merge'
import {
  createClient, ClientOpts as Config, RedisClient
} from 'redis'

export interface RedisConfig {
  name?: string
  config?: Config
}

const Name = 'redis'

if (!global['FaasJS_Redis']) {
  global.FaasJS_Redis = {}
}

type SET = {
  /** seconds -- Set the specified expire time, in seconds */
  EX?: number
  /** milliseconds -- Set the specified expire time, in milliseconds */
  PX?: number
  /** timestamp-seconds -- Set the specified Unix time at which the key will expire, in seconds */
  EXAT?: number
  /** timestamp-milliseconds -- Set the specified Unix time at which the key will expire, in milliseconds */
  PXAT?: number
  /** Only set the key if it does not already exist */
  NX?: boolean
  /** Only set the key if it already exist */
  XX?: boolean
  /**Retain the time to live associated with the key */
  KEEPTTL?: boolean
  /** Return the old string stored at key, or nil if key did not exist. An error is returned and SET aborted if the value stored at key is not a string */
  GET?: boolean
}

/**
 * Redis 插件
 */
export class Redis implements Plugin {
  public readonly type: string = Name
  public readonly name: string = Name
  public config: Config
  public adapter: RedisClient
  public logger: Logger

  /**
   * 创建插件实例
   * @param config {object} 配置
   * @param config.name {string} 配置名
   * @param config.config {object} Redis 配置
   */
  constructor (config?: RedisConfig) {
    if (config == null) config = Object.create(null)

    this.name = config?.name || this.type
    this.config = (config?.config) || Object.create(null)
    this.logger = new Logger(this.name)
  }

  public async onMount (data: MountData, next: Next): Promise<void> {
    if (global.FaasJS_Redis[this.name] && (global.FaasJS_Redis[this.name].adapter)) {
      this.config = global.FaasJS_Redis[this.name].config
      this.adapter = global.FaasJS_Redis[this.name].adapter
      this.logger.debug('use exists adapter')
    } else {
      const prefix = `SECRET_${this.name.toUpperCase()}_`

      for (let key in process.env)
        if (key.startsWith(prefix)) {
          const value = process.env[key]
          key = key.replace(prefix, '').toLowerCase()
          if (typeof this.config[key] === 'undefined') this.config[key] = value
        }

      if (data?.config.plugins && data.config.plugins[this.name])
        this.config = deepMerge(data.config.plugins[this.name].config, this.config)

      this.adapter = createClient(this.config)
      this.logger.debug('connceted')

      global.FaasJS_Redis[this.name] = this
    }

    await next()
  }

  public async query<TResult = any> (command: string, args: any[]): Promise<TResult> {
    if (!global.FaasJS_Redis[this.name]) throw Error(`[${this.name}] not monuted`)

    if (!this.config) this.config = global.FaasJS_Redis[this.name].config
    if (this.adapter == null) this.adapter = global.FaasJS_Redis[this.name].adapter

    this.logger.debug('query begin: %s %O', command, args)
    this.logger.time(command)

    return new Promise((resolve, reject) => {
      this.adapter.sendCommand(command, args, (err, data: TResult) => {
        if (err) {
          this.logger.timeEnd(command, 'query fail: %s %O', command, err)
          reject(err)
        } else {
          this.logger.timeEnd(command, 'query success: %s %O', command, data)
          resolve(data)
        }
      })
    })
  }

  public async quit (): Promise<void> {
    if (!global.FaasJS_Redis[this.name]) return

    try {
      await new Promise<void>(resolve => {
        global.FaasJS_Redis[this.name].adapter.quit(() => {
          delete global.FaasJS_Redis[this.name]
          resolve()
        })
      })
    } catch (error) {
      console.error(error)
    }
  }

  public async get<TData = any> (key: string): Promise<TData> {
    return this.query('GET', [key])
  }

  public async getJSON<TData = any> (key: string): Promise<TData> {
    const data = await this.query('GET', [key])

    if (typeof data !== 'string') return data

    return JSON.parse(data)
  }

  public async set<TResult = void> (key: string, value: any, options?: SET): Promise<TResult> {
    const args = [key, value]

    if (options) {
      if ('EX' in options) {
        args.push('EX', options.EX.toString())
      } else if ('PX' in options) {
        args.push('PX', options.PX.toString())
      } else if ('EXAT' in options) {
        args.push('EXAT', options.EXAT.toString())
      } else if ('PXAT' in options) {
        args.push('PXAT', options.PXAT.toString())
      } else if (options.KEEPTTL) {
        args.push('KEEPTTL')
      }

      if (options.NX) {
        args.push('NX')
      } else if (options.XX) {
        args.push('XX')
      }

      if (options.GET) {
        args.push('GET')
      }
    }

    return this.query('SET', args)
  }

  public async setJSON<TResult = void> (key: string, value: any, options?: SET): Promise<TResult> {
    return this.set(key, JSON.stringify(value), options)
  }
}

export function useRedis (config?: RedisConfig): Redis & UseifyPlugin {
  const name = config?.name || Name

  if (global.FaasJS_Redis[name]) return usePlugin<Redis>(global.FaasJS_Redis[name])

  return usePlugin<Redis>(new Redis(config))
}

export async function query<TResult = any> (command: string, args: any[]): Promise<TResult> {
  return useRedis().query<TResult>(command, args)
}

export async function get<TResult = any> (key: string): Promise<TResult> {
  return useRedis().get<TResult>(key)
}

export async function set<TResult = void> (
  key: string,
  value: any,
  options?: SET
): Promise<TResult> {
  return useRedis().set<TResult>(key, value, options)
}

export async function getJSON<TResult = any> (key: string): Promise<TResult> {
  return useRedis().getJSON<TResult>(key)
}

export async function setJSON<TResult = void> (
  key: string,
  value: any,
  options?: SET
): Promise<TResult> {
  return useRedis().setJSON<TResult>(key, value, options)
}
