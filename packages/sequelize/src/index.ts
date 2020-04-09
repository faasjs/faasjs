import { Plugin, Next, DeployData, MountData } from '@faasjs/func';
import { Sequelize as Seq, Options, Model as SequelizeModel, DataTypes, ModelAttributes, InitOptions as SeqInitOptions } from 'sequelize';
import Logger from '@faasjs/logger';
import deepMerge from '@faasjs/deep_merge';

export { DataTypes };

export interface InitOptions extends Omit<SeqInitOptions, 'sequelize'> {
  sequelize?: Seq;
}

export interface ModelInitOptions {
  attributes: ModelAttributes;
  options?: InitOptions;
}

export class Model extends SequelizeModel {
  static initData: ModelInitOptions;

  static setInitData (data: ModelInitOptions) {
    this.initData = data;
  }
}

type ModelCtor<M extends Model> = { new (): M } & typeof Model;

interface SequelizeConfig extends Options {
  models: ModelCtor<Model>[];
}

/**
 * Sequelize 插件
 */
export class Sequelize implements Plugin {
  public type: string = 'sequelize';
  public name: string;
  public config: SequelizeConfig;
  public connection: Seq;
  public logger: Logger;

  /**
   * 创建插件实例
   * @param config {object} 配置
   * @param config.name {string} 配置名
   * @param config.config {object} 数据库配置
   */
  constructor (config?: {
    name?: string;
    config?: SequelizeConfig;
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
    const dialect = data.config.plugins[this.name].config.dialect;
    switch (dialect) {
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
      default:
        throw Error(`[${this.name}] Unsupport dialect: ${dialect}`);
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

    if (data.config.plugins[this.name] && data.config.plugins[this.name].config)
      this.config = deepMerge(data.config.plugins[this.name].config, this.config);

    this.connection = new Seq(this.config);
    await this.connection.authenticate();

    for (const model of this.config.models) {
      model.init(model.initData.attributes, {
        sequelize: this.connection,
        ...model.initData.options
      });
      if (this.config.sync && this.config.sync.force) await model.sync();
    }

    await next();
  }
}
