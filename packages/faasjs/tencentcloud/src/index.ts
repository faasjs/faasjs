import { DeployData } from '@faasjs/func';
import Logger from '@faasjs/logger';
import deployCloudFunction from './cloud_function/deploy';
import * as invoke from './cloud_function/invoke';
import deployHttp from './http/deploy';

export interface TencentcloudConfig {
  secretId: string;
  secretKey: string;
  region: string;
  [key: string]: any;
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
  public deploy (type: string, data: DeployData, config: any) {
    switch (type) {
      case 'cloud_function':
        return deployCloudFunction.call(this, data, config);
      case 'http':
        return deployHttp.call(this, data, config);
      default:
        throw Error(`Unknow deploy type: ${type}`);
    }
  }

  public async invokeCloudFunction (name: string, data: {
    event: any;
    context: any;
  }, options?: {
    [key: string]: any;
  }) {
    return invoke.invokeCloudFunction.call(this, name, data, options);
  }

  public async invokeSyncCloudFunction (name: string, data: {
    event: any;
    context: any;
  }, options?: {
    [key: string]: any;
  }) {
    return invoke.invokeSyncCloudFunction.call(this, name, data, options);
  }
}
