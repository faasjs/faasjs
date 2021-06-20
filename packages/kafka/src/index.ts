import { Plugin, Next, MountData, usePlugin, UseifyPlugin } from '@faasjs/func'
import Logger from '@faasjs/logger'
import deepMerge from '@faasjs/deep_merge'
import { Kafka as K, KafkaConfig as KConfig, Producer, ProducerRecord, RecordMetadata } from 'kafkajs'

export interface KafkaConfig {
  name?: string
  config?: KConfig
}

const Name = 'kafka'

const globals: {
  [name: string]: Kafka
} = {}

/**
 * Kafka 插件
 */
export class Kafka implements Plugin {
  public readonly type: string = Name
  public readonly name: string = Name
  public config: KConfig
  public client: K
  public producer: Producer
  public logger: Logger

  /**
   * 创建插件实例
   * @param config {object} 配置
   * @param config.name {string} 配置名
   * @param config.config {object} 配置项
   */
  constructor (config?: KafkaConfig) {
    if (config) {
      this.name = config.name || this.type
      this.config = (config.config) || Object.create(null)
    } else {
      this.name = this.type
      this.config = Object.create(null)
    }
    this.logger = new Logger(this.name)
  }

  public async onMount (data: MountData, next: Next): Promise<void> {
    if (globals[this.name]) {
      this.config = globals[this.name].config
      this.client = globals[this.name].client
      this.producer = globals[this.name].producer
      await next()
      return
    }
    const prefix = `SECRET_${this.name.toUpperCase()}_`

    for (let key in process.env)
      if (key.startsWith(prefix)) {
        const value = process.env[key]
        key = key.replace(prefix, '').toLowerCase()
        if (typeof this.config[key] === 'undefined') this.config[key] = value
      }


    if (data.config.plugins && (data.config.plugins[this.name].config)) this.config = deepMerge(data.config.plugins[this.name].config, this.config)

    this.client = new K(this.config)
    this.producer = this.client.producer()

    await this.producer.connect()

    this.logger.debug('connected')

    globals[this.name] = this

    await next()
  }

  public async sendMessage (record: ProducerRecord): Promise<RecordMetadata[]> {
    return this.producer.send(record)
  }
}

export function useKafka (config?: KafkaConfig): Kafka & UseifyPlugin {
  const name = config?.name || Name

  if (globals[name]) return usePlugin<Kafka>(globals[name])

  return usePlugin<Kafka>(new Kafka(config))
}
