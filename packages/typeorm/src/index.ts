import { Plugin, Next, DeployData, MountData } from '@faasjs/func';
import 'reflect-metadata';
import { createConnection, ConnectionOptions, getConnection, Connection, ObjectType, EntitySchema, Repository, QueryRunner, SelectQueryBuilder } from 'typeorm';
import { BaseConnectionOptions as OriginBaseConnectionOptions } from 'typeorm/connection/BaseConnectionOptions';
import { DatabaseType } from 'typeorm/driver/types/DatabaseType';
import Logger from '@faasjs/logger';
import deepMerge from '@faasjs/deep_merge';

export { Connection, Repository, SelectQueryBuilder };

type BaseConnectionOptions = Omit<OriginBaseConnectionOptions, keyof {
  type?: DatabaseType;
}>

export type TypeORMConfig = BaseConnectionOptions | ConnectionOptions;

/**
 * TypeORM 插件
 */
export class TypeORM implements Plugin {
  public type: string = 'typeORM';
  public name: string;
  public config: TypeORMConfig;
  public connection: Connection;
  public logger: Logger;
  public createQueryBuilder: <Entity>(entityClass: ObjectType<Entity> | EntitySchema<Entity> | Function | string, alias: string, queryRunner?: QueryRunner) => SelectQueryBuilder<Entity>;

  /**
   * 创建插件实例
   * @param config {object} 配置
   * @param config.name {string} 配置名
   * @param config.config {object} 数据库配置
   */
  constructor (config?: {
    name?: string;
    config?: TypeORMConfig;
  }) {
    if (config) {
      this.name = config.name || 'typeORM';
      this.config = config.config || Object.create(null);
    } else {
      this.name = 'typeORM';
      this.config = Object.create(null);
    }
    this.config = Object.assign(this.config, { logging: 'all' });
    this.logger = new Logger('TypeORM');
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
    this.logger.debug('[Mount] begin');
    this.logger.time('typeorm');

    try {
      this.connection = getConnection();
      if (!this.connection.isConnected) throw Error('Not Connected');
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
    }

    // eslint-disable-next-line @typescript-eslint/unbound-method
    this.createQueryBuilder = this.connection.createQueryBuilder;

    this.logger.timeEnd('typeorm', '[Mount] end');

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
}
