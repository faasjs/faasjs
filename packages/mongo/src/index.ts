import { MongoClientOptions, Db, MongoClient, Collection, DbCollectionOptions, MongoCallback } from 'mongodb';
import { Plugin, MountData, Next } from '@faasjs/func';
import Logger from '@faasjs/logger';
import deepMerge from '@faasjs/deep_merge';

export interface MongoConfig extends MongoClientOptions {
  url?: string;
  database?: string;
}

export class Mongo implements Plugin {
  public type: string = 'mongo';
  public name: string;
  public config: MongoConfig;
  public logger: Logger;
  public client: MongoClient;
  public db: Db;
  public collection: <TSchema>(name: string, options?: DbCollectionOptions, callback?: MongoCallback<Collection<TSchema>>) => Collection<TSchema>;

  /**
   * 创建插件实例
   * @param config {object} 配置
   * @param config.name {string} 配置名
   * @param config.adapterType {string} 适配类型
   * @param config.config {object} 数据库配置
   * @param config.config.pool {Database} 数据库连接实例
   */
  constructor (config?: {
    name?: string;
    adapterType?: string;
    config?: MongoConfig;
  }) {
    if (config) {
      this.name = config.name || this.type;
      this.config = config.config || Object.create(null);
    } else {
      this.name = this.type;
      this.config = Object.create(null);
    }
    this.logger = new Logger(this.name);
  }

  public async onMount (data: MountData, next: Next): Promise<void> {
    this.logger.debug('[Mount] begin');
    this.logger.time(this.name);

    const prefix = `SECRET_${this.name.toUpperCase()}_`;

    for (let key in process.env)
      if (key.startsWith(prefix)) {
        const value = process.env[key];
        key = key.replace(prefix, '').toLowerCase();
        if (typeof this.config[key] === 'undefined') this.config[key] = value;
      }

    if (data.config.plugins[this.name])
      this.config = deepMerge(data.config.plugins[this.name].config, this.config);

    if (typeof this.config.loggerLevel === 'undefined') this.config.loggerLevel = 'debug';
    if (typeof this.config.useNewUrlParser === 'undefined') this.config.useNewUrlParser = true;
    if (typeof this.config.useUnifiedTopology === 'undefined') this.config.useUnifiedTopology = true;

    this.logger.debug('conncet: %o', this.config);

    this.client = await MongoClient.connect(this.config.url, this.config);

    if (this.config.database) {
      this.db = this.client.db(this.config.database);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      this.collection = this.db.collection;
    }

    this.logger.timeEnd(this.name, '[Mount] end');

    await next();
  }
}
