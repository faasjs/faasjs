import { Plugin, MountData, Next, usePlugin } from '@faasjs/func';
import Logger from '@faasjs/logger';
import deepMerge from '@faasjs/deep_merge';
import { createClient, ClientOpts as Config, RedisClient } from 'redis';

export interface RedisConfig {
  name?: string;
  config?: Config;
}

/**
 * 数据库插件
 */
export class Redis implements Plugin {
  public type: string = 'redis';
  public name?: string;
  public config: Config;
  public adapter?: RedisClient;
  public logger: Logger;

  /**
   * 创建插件实例
   * @param config {object} 配置
   * @param config.name {string} 配置名
   * @param config.config {object} Redis 配置
   */
  constructor (config?: RedisConfig) {
    if (!config) config = Object.create(null);

    this.name = config.name || this.type;
    this.config = config.config || Object.create(null);
    this.logger = new Logger(this.name);
  }

  public async onMount (data: MountData, next: Next) {
    const prefix = `SECRET_${this.name.toUpperCase()}_`;

    for (let key in process.env)
      if (key.startsWith(prefix)) {
        const value = process.env[key];
        key = key.replace(prefix, '').toLowerCase();
        if (typeof this.config[key] === 'undefined') this.config[key] = value;
      }

    if (data.config.plugins[this.name])
      this.config = deepMerge(data.config.plugins[this.name].config, this.config);

    this.logger.debug('conncet: %O', this.config);
    this.adapter = createClient(this.config);

    await next();
  }

  public async query<TResult = any> (command: string, args: any[]): Promise<TResult> {
    this.logger.debug('query begin: %s %O', command, args);
    this.logger.time(command);

    return new Promise((resolve, reject) => {
      this.adapter.sendCommand(command, args, (err, data: TResult) => {
        if (err) {
          this.logger.timeEnd(command, 'query fail: %s %O', command, err);
          reject(err);
        } else {
          this.logger.timeEnd(command, 'query success: %s %O', command, data);
          resolve(data);
        }
      });
    });
  }
}

export function useRedis (config?: RedisConfig): Redis {
  return usePlugin(new Redis(config));
}
