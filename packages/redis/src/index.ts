import {
  Plugin, MountData, Next, usePlugin, UseifyPlugin 
} from '@faasjs/func'
import Logger from '@faasjs/logger'
import deepMerge from '@faasjs/deep_merge'
import {
  createClient, ClientOpts as Config, RedisClient 
} from 'redis'

export interface RedisConfig {
  name?: string
  config?: Config
}

const Name = 'redis'

const globals: {
  [name: string]: Redis
} = {}

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
    if (globals[this.name] && (globals[this.name].adapter)) {
      this.config = globals[this.name].config
      this.adapter = globals[this.name].adapter
      this.logger.debug('use exists adapter')
    } else {
      const prefix = `SECRET_${this.name.toUpperCase()}_`

      for (let key in process.env)
        if (key.startsWith(prefix)) {
          const value = process.env[key]
          key = key.replace(prefix, '').toLowerCase()
          if (typeof this.config[key] === 'undefined') this.config[key] = value
        }


      if (data?.config.plugins && data.config.plugins[this.name]) this.config = deepMerge(data.config.plugins[this.name].config, this.config)

      this.adapter = createClient(this.config)
      this.logger.debug('connceted')

      globals[this.name] = this
    }

    await next()
  }

  public async query<TResult = any> (command: string, args: any[]): Promise<TResult> {
    if (!globals[this.name]) throw Error(`[${this.name}] not monuted`)

    if (!this.config) this.config = globals[this.name].config
    if (this.adapter == null) this.adapter = globals[this.name].adapter

    this.logger.debug('query begin: %s %O', command, args)
    this.logger.time(command)

    return await new Promise((resolve, reject) => {
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
    if (!globals[this.name]) return

    try {
      await new Promise<void>(resolve => {
        globals[this.name].adapter.quit(() => {
          delete globals[this.name]
          resolve()
        })
      })
    } catch (error) {
      console.error(error)
    }
  }
}

export function useRedis (config?: RedisConfig): Redis & UseifyPlugin {
  const name = config?.name || Name

  if (globals[name]) return usePlugin<Redis>(globals[name])

  return usePlugin<Redis>(new Redis(config))
}
