import { Plugin, Next, DeployData, MountData } from '@faasjs/func';
import Logger from '@faasjs/logger';
import deepMerge from '@faasjs/deep_merge';
import knex, { Config, Transaction, QueryBuilder, Raw, AliasDict, Value } from 'knex';

export type KnexConfig = Config;

/**
 * TypeORM 插件
 */
export class Knex implements Plugin {
  public type: string = 'knex';
  public name: string;
  public config: KnexConfig;
  public connection: knex;
  public logger: Logger;

  /**
   * 创建插件实例
   * @param config {object} 配置
   * @param config.name {string} 配置名
   * @param config.config {object} 数据库配置
   */
  constructor (config?: {
    name?: string;
    config?: KnexConfig;
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

  public async onDeploy (data: DeployData, next: Next): Promise<void> {
    const client = (data.config.plugins[this.name].config as KnexConfig).client as string;
    data.dependencies[client] = '*';
    await next();
  }

  public async onMount (data: MountData, next: Next): Promise<void> {
    const prefix = `SECRET_${this.name.toUpperCase()}_`;

    for (let key in process.env)
      if (key.startsWith(prefix)) {
        const value = process.env[key];
        key = key.replace(prefix, '').toLowerCase();
        if (typeof this.config[key] === 'undefined')
          if (key.startsWith('connection_')) {
            if (!this.config.connection) this.config.connection = {};
            this.config.connection[key.replace('connection_', '')] = value;
          } else
            this.config[key] = value;
      }

    if (data.config.plugins[this.name] && data.config.plugins[this.name].config)
      this.config = deepMerge(data.config.plugins[this.name].config, this.config);

    this.connection = knex(this.config);

    this.connection
      .on('query', ({ sql, __knexQueryUid }) => {
        this.logger.time(`Knex${__knexQueryUid}`);
        this.logger.debug('query begin: %s', sql);
      })
      .on('query-response', (_, { sql, __knexQueryUid }) => {
        this.logger.timeEnd(`Knex${__knexQueryUid}`, 'query done: %s', sql);
      })
      .on('query-error', (_, { __knexQueryUid, sql }) => {
        this.logger.timeEnd(`Knex${__knexQueryUid}`, 'query failed: %s', sql);
      });
    await this.raw('SELECT 1+1');
    this.logger.debug('connected');

    await next();
  }

  public query<TRecord = any, TResult = any> (tableName?: string | Raw<TResult> | QueryBuilder<TRecord, TResult> | AliasDict): QueryBuilder<TRecord, TResult> {
    return this.connection<TRecord, TResult>(tableName);
  }

  public async raw<TResult = any> (value: Value): Promise<Raw<TResult>> {
    return this.connection.raw<TResult>(value);
  }

  public async transaction<TResult = any> (scope: (trx: Transaction) => Promise<TResult> | void): Promise<TResult> {
    return this.connection.transaction<TResult>(scope);
  }
}
