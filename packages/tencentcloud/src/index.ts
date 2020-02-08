import { DeployData } from '@faasjs/func';
import Logger from '@faasjs/logger';
import deployCloudFunction from './cloud_function/deploy';
import * as invoke from './cloud_function/invoke';
import deployHttp from './http/deploy';

export interface TencentcloudConfig {
  [key: string]: any;
  secretId: string;
  secretKey: string;
  region: string;
}

export default class Tencentcloud {
  public config: TencentcloudConfig;
  public logger: Logger;

  constructor (config: TencentcloudConfig) {
    this.config = config;
    this.logger = new Logger('Tencentcloud');
  }
  /**
   * 部署
   * @param type {string} 发布类型，支持 function
   * @param data {object} 部署环境配置
   * @param config {Logger} 部署对象配置
   */
  public async deploy (type: string, data: DeployData, config: any): Promise<void> {
    switch (type) {
      case 'cloud_function':
        await deployCloudFunction(this, data, config);
        break;
      case 'http':
        await deployHttp(this, data, config);
        break;
      default:
        throw Error(`Unknow deploy type: ${type}`);
    }
  }

  public async invokeCloudFunction (name: string, data: {
    event: any;
    context: any;
  }, options?: {
    [key: string]: any;
  }): Promise<any> {
    return invoke.invokeCloudFunction(this, name, data, options);
  }

  public async invokeSyncCloudFunction (name: string, data: {
    event: any;
    context: any;
  }, options?: {
    [key: string]: any;
  }): Promise<any> {
    return invoke.invokeSyncCloudFunction(this, name, data, options);
  }
}
