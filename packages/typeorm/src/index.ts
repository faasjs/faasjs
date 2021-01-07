import { Plugin, Next, DeployData, MountData, UseifyPlugin, usePlugin } from '@faasjs/func';
import 'reflect-metadata';
import { createConnection, ConnectionOptions, getConnection, Connection, ObjectType, EntitySchema, Repository, SelectQueryBuilder, getRepository } from 'typeorm';
import { BaseConnectionOptions as OriginBaseConnectionOptions } from 'typeorm/connection/BaseConnectionOptions';
import { DatabaseType } from 'typeorm/driver/types/DatabaseType';
import Logger from '@faasjs/logger';
import deepMerge from '@faasjs/deep_merge';

export { Connection, Repository, SelectQueryBuilder, getRepository };

type BaseConnectionOptions = Omit<OriginBaseConnectionOptions, keyof {
  type?: DatabaseType;
}>

type Config = BaseConnectionOptions | ConnectionOptions;

export type TypeORMConfig = {
  name?: string;
  config?: Config;
}

const Name = 'typeORM';

const globals: {
  [name: string]: TypeORM;
} = {};

/**
 * TypeORM 插件
 */
export class TypeORM implements Plugin {
  public type: string = Name;
  public name: string;
  public config: Config;
  public connection: Connection;
  public logger: Logger;

  /**
   * 创建插件实例
   * @param config {object} 配置
   * @param config.name {string} 配置名
   * @param config.config {object} 数据库配置
   */
  constructor (config?: TypeORMConfig) {
    if (config) {
      this.name = config.name || this.type;
      this.config = config.config || Object.create(null);
    } else {
      this.name = this.type;
      this.config = Object.create(null);
    }
    this.config = Object.assign(this.config, { logging: 'all' });
    this.logger = new Logger(this.name);
  }

  public async onDeploy (data: DeployData, next: Next): Promise<void> {
    const type = data.config.plugins[this.name].config.type;
    switch (type) {
      case 'sqlite':
        data.dependencies['sqlite3'] = '*';
        break;
      case 'postgres':
        data.dependencies['pg'] = '*';
        break;
      case 'mysql':
      case 'mariadb':
        data.dependencies['mysql'] = '*';
        break;
      case 'mssql':
        data.dependencies['mssql'] = '*';
        break;
      case 'sqljs':
        data.dependencies['sql.js'] = '*';
        break;
      case 'oracle':
        data.dependencies['oracledb'] = '*';
        break;
      case 'mongodb':
        data.dependencies['mongodb'] = '*';
        break;
      default:
        throw Error(`[TypeORM] Unsupport type: ${type}`);
    }
    await next();
  }

  public async onMount (data: MountData, next: Next): Promise<void> {
    if (globals[this.name]) {
      this.config = globals[this.name].config;
      this.connection = globals[this.name].connection;
      await next();
      return;
    }

    try {
      this.connection = getConnection();
      if (this.connection.isConnected) await this.connection.close();
      throw Error('[TypeORM] Connecting');
    } catch (error) {
      const prefix = `SECRET_${this.name.toUpperCase()}_`;

      for (let key in process.env)
        if (key.startsWith(prefix)) {
          const value = process.env[key];
          key = key.replace(prefix, '').toLowerCase();
          if (typeof this.config[key] === 'undefined') this.config[key] = value;
        }

      if (data.config.plugins[this.name] && data.config.plugins[this.name].config)
        this.config = deepMerge(data.config.plugins[this.name].config, this.config);

      this.connection = await createConnection(this.config as ConnectionOptions);
      this.logger.debug('connected');
    }

    globals[this.name] = this;

    await next();
  }

  public getRepository<Entity> (model: ObjectType<Entity> | EntitySchema<Entity>): Repository<Entity> {
    return this.connection.getRepository(model);
  }

  public getTreeRepository<Entity> (model: ObjectType<Entity> | EntitySchema<Entity>): Repository<Entity> {
    return this.connection.getTreeRepository(model);
  }

  public getMongoRepository<Entity> (model: ObjectType<Entity> | EntitySchema<Entity>): Repository<Entity> {
    return this.connection.getMongoRepository(model);
  }

  public getCustomRepository<T> (customRepository: ObjectType<T>): T {
    return this.connection.getCustomRepository(customRepository);
  }

  public async close (): Promise<void> {
    try {
      delete globals[this.name];
      await globals[this.name].connection.close();
    } catch (error) {
      console.error(error);
    }
  }
}

export function useTypeORM (config?: TypeORMConfig): TypeORMConfig & UseifyPlugin {
  const name = config?.name || Name;

  if (globals[name]) return usePlugin<TypeORM>(globals[name]);

  return usePlugin<TypeORM>(new TypeORM(config));
}
