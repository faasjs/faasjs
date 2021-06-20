import { Plugin, MountData, Next, DeployData, usePlugin, UseifyPlugin } from '@faasjs/func';
import Logger from '@faasjs/logger';
import deepMerge from '@faasjs/deep_merge';
import { Sqlite, SqliteConfig } from './sqlite';
import { Postgresql, PostgresqlConfig } from './postgresql';
import { Mysql, MysqlConfig } from './mysql';

export type AdapterType = 'sqlite' | 'postgresql' | 'mysql'

export interface Adapter {
  pool: any
  query: (sql: string, values?: any) => Promise<any[]>
}

export type SqlConfig = {
  name?: string
} & ({
  adapterType?: 'sqlite'
  config?: SqliteConfig
} | {
  adapterType?: 'postgresql'
  config?: PostgresqlConfig
} | {
  adapterType?: 'mysql'
  config?: MysqlConfig
})

const Name = 'sql';

const globals: {
  [name: string]: Sql
} = {};

/**
 * 数据库插件
 */
export class Sql implements Plugin {
  public type: string = Name
  public name: string = Name
  public config: SqlConfig
  public adapterType?: AdapterType
  public adapter?: Adapter
  public logger: Logger

  /**
   * 创建插件实例
   * @param config {object} 配置
   * @param config.name {string} 配置名
   * @param config.adapterType {string} 适配类型
   * @param config.config {object} 数据库配置
   * @param config.config.pool {Database} 数据库连接实例
   */
  constructor (config?: SqlConfig) {
    if (config != null) {
      this.name = config.name || this.type;
      this.adapterType = config.adapterType;
      this.config = (config.config != null) || Object.create(null);
    } else {
      this.name = this.type;
      this.config = Object.create(null);
    }
    this.logger = new Logger(this.name);
  }

  public async onDeploy (data: DeployData, next: Next): Promise<void> {
    switch (this.adapterType || data.config.plugins[this.name || this.type].adapter) {
      case 'sqlite':
        data.dependencies.sqlite3 = '*';
        break;
      case 'postgresql':
        data.dependencies.pg = '*';
        break;
      case 'mysql':
        data.dependencies.mysql2 = '*';
        break;
      default:
        throw Error(`[Sql] Unsupport type: ${this.adapterType || data.config.plugins[this.name || this.type].type}`);
    }
    await next();
  }

  public async onMount (data: MountData, next: Next): Promise<void> {
    const prefix = `SECRET_${this.name.toUpperCase()}_`;

    for (let key in process.env) 
      if (key.startsWith(prefix)) {
        const value = process.env[key];
        key = key.replace(prefix, '').toLowerCase();
        if (typeof this.config[key] === 'undefined') this.config[key] = value;
      }
    

    if (data.config.plugins[this.name]) this.config = deepMerge(data.config.plugins[this.name].config, this.config); 

    this.logger.debug('conncet: %O', this.config);

    if (!this.adapterType) this.adapterType = data.config.plugins[this.name || this.type].adapter; 

    switch (this.adapterType) {
      case 'sqlite':
        this.adapter = new Sqlite(this.config);
        break;
      case 'postgresql':
        this.adapter = new Postgresql(this.config);
        break;
      case 'mysql':
        this.adapter = new Mysql(this.config);
        break;
      default:
        throw Error(`[Sql] Unsupport type: ${this.type}`);
    }

    globals[this.name] = this;

    await next();
  }

  /**
   * 执行 SQL
   * @param sql {string} SQL 语句
   * @param values {any} 参数值
   */
  public async query<TResult = any> (sql: string, values?: any[]): Promise<TResult[]> {
    this.logger.debug('query begin: %s %O', sql, values);
    this.logger.time(sql);
    try {
      const res = await this.adapter.query(sql, values);
      this.logger.timeEnd(sql, 'query end: %s %O', sql, res);
      return res;
    } catch (error) {
      this.logger.timeEnd(sql, 'query end: %s', sql);
      throw error;
    }
  }

  /**
   * 执行多条 SQL
   * @param sqls {string[]} SQL 语句
   */
  public async queryMulti<TResult> (sqls: string[]): Promise<TResult[]> {
    const results = [];
    for (const sql of sqls) results.push(await this.query(sql)); 

    return results;
  }

  /**
   * 执行 SQL 并只返回第一条结果
   * @param sql {string} SQL 语句
   * @param values {any} 参数值
   */
  public async queryFirst<TResult = any> (sql: string, values?: any[]): Promise<TResult> {
    return await this.query(sql, values).then((res: any[]) => res[0]);
  }
}

export function useSql (config?: SqlConfig): Sql & UseifyPlugin {
  const name = config?.name || Name;

  if (globals[name]) return usePlugin<Sql>(globals[name]);

  return usePlugin<Sql>(new Sql(config));
}
