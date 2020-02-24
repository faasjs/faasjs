import { Plugin, Next, DeployData, MountData } from '@faasjs/func';
import 'reflect-metadata';
import { createConnection, ConnectionOptions, Connection, Entity, ObjectType, EntitySchema, Repository } from 'typeorm';
import Logger from '@faasjs/logger';
import deepMerge from '@faasjs/deep_merge';

/**
 * TypeORM 插件
 */
export class TypeORM implements Plugin {
  public type: string = 'typeORM';
  public name: string;
  public config: ConnectionOptions;
  public connection: Connection;
  public logger: Logger;

  /**
   * 创建插件实例
   * @param config {object} 配置
   * @param config.name {string} 配置名
   * @param config.config {object} 数据库配置
   */
  constructor (config?: {
    name?: string;
    config?: ConnectionOptions;
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
    
    if (data.config.plugins[this.name] && data.config.plugins[this.name].config) 
      this.config = deepMerge(data.config.plugins[this.name].config, this.config);
    
    this.connection = await createConnection(this.config);

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
