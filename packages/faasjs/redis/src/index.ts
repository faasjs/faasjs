import { Plugin, MountData, Next } from '@faasjs/func';
import Logger from '@faasjs/logger';
import deepMerge from '@faasjs/deep_merge';
import { createClient, ClientOpts as RedisConfig, RedisClient } from 'redis';

/**
 * 数据库插件
 */
export class Redis implements Plugin {
  public type: string;
  public name?: string;
  public config: RedisConfig;
  public adapter?: RedisClient;
  public logger: Logger;

  /**
   * 创建插件实例
   * @param config {object} 配置
   * @param config.name {string} 配置名
   * @param config.config {object} Redis 配置
   */
  constructor (config?: {
    name?: string;
    config?: RedisConfig;
  }) {
    if (!config) {
      config = Object.create(null);
    }
    this.name = config!.name;
    this.type = 'redis';
    this.config = config!.config || Object.create(null);
    this.logger = new Logger('Redis');
  }

  public async onMount (data: MountData, next: Next) {
    this.logger.debug('[Mount] begin');
    this.logger.time('redis');

    if (data.config.plugins[this.name || this.type]) {
      this.config = deepMerge(data.config.plugins[this.name || this.type].config, this.config);
    }

    this.logger.debug('conncet: %o', this.config);
    this.adapter = createClient(this.config);

    this.logger.timeEnd('redis', '[Mount] end');

    await next();
  }

  public query (command: string, args: any[]) {
    this.logger.debug('query begin: %s %o', command, args);
    this.logger.time(command);

    return new Promise((resolve, reject) => {
      this.adapter!.sendCommand(command, args, (err, data) => {
        if (err) {
          this.logger.timeEnd(command, 'query fail: %s %o', command, err);
          reject(err);
        } else {
          this.logger.timeEnd(command, 'query success: %s %o', command, data);
          resolve(data);
        }
      });
    });
  }
}
