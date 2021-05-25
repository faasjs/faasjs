import { Plugin, Next, DeployData, MountData, usePlugin, UseifyPlugin } from '@faasjs/func';
import Logger from '@faasjs/logger';
import deepMerge from '@faasjs/deep_merge';
import knex, { Knex as K } from 'knex';

export type KnexConfig = {
  name?: string;
  config?: K.Config;
};

const Name = 'knex';

const globals: {
  [name: string]: Knex;
} = {};

/**
 * Knex 插件
 */
export class Knex implements Plugin {
  public readonly type: string = Name;
  public readonly name: string = Name;
  public config: K.Config;
  public adapter: K;
  public logger: Logger;

  /**
   * 创建插件实例
   * @param config {object} 配置
   * @param config.name {string} 配置名
   * @param config.config {object} 数据库配置
   */
  constructor (config?: KnexConfig) {
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
    const client = (data.config.plugins[this.name].config as K.Config).client as string;
    if (!client) throw Error('[Knex] client required.');

    data.dependencies[client] = '*';
    this.logger.debug('add dependencies: ' + client);

    await next();
  }

  public async onMount (data: MountData, next: Next): Promise<void> {
    if (globals[this.name]) {
      this.config = globals[this.name].config;
      this.adapter = globals[this.name].adapter;
      await next();
      return;
    }
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

    this.adapter = knex(this.config);

    this.adapter
      .on('query', ({ sql, __knexQueryUid, bindings }) => {
        this.logger.time(`Knex${__knexQueryUid}`);
        this.logger.debug('query begin: %s %O', sql, bindings);
      })
      .on('query-response', (response, { sql, __knexQueryUid, bindings }) => {
        this.logger.timeEnd(`Knex${__knexQueryUid}`, 'query done: %s %O %O', sql, bindings, response);
      })
      .on('query-error', (_, { __knexQueryUid, sql, bindings }) => {
        this.logger.timeEnd(`Knex${__knexQueryUid}`, 'query failed: %s %O', sql, bindings);
      });
    this.logger.debug('connected');

    globals[this.name] = this;

    await next();
  }

  public query<TRecord = any, TResult = any> (tableName?: string | K.Raw<TResult> | K.QueryBuilder<TRecord, TResult> | K.AliasDict): K.QueryBuilder<TRecord, TResult> {
    return this.adapter<TRecord, TResult>(tableName);
  }

  public async raw<TResult = any> (sql: string, bindings?: K.RawBinding[] | K.ValueDict): Promise<K.Raw<TResult>> {
    return this.adapter.raw<TResult>(sql, bindings);
  }

  public async transaction<TResult = any> (scope: (trx: K.Transaction<any, any>) => Promise<TResult> | void, config?: K.TransactionConfig): Promise<TResult> {
    return this.adapter.transaction(scope, config);
  }

  public schema (): K.SchemaBuilder {
    return this.adapter.schema;
  }

  public async quit (): Promise<void> {
    try {
      await globals[this.name].adapter.destroy();
      delete globals[this.name];
    } catch (error) {
      console.error(error);
    }
  }
}

export function useKnex (config?: KnexConfig): Knex & UseifyPlugin {
  const name = config?.name || Name;

  if (globals[name]) return usePlugin<Knex>(globals[name]);

  return usePlugin<Knex>(new Knex(config));
}
