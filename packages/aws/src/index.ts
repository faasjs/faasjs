import { DeployData } from '@faasjs/func'
import { Logger } from '@faasjs/logger'
import { CloudFunctionAdapter } from '@faasjs/cloud_function'
import { deployLambda } from './lambda'

/**
 * 云 API 配置项
 * 优先读取环境变量，如果没有则读取入参
 */
export type AWSConfig = {
  appId?: string
  secretId?: string
  secretKey?: string
  region?: string
  token?: string
}

export class Provider implements CloudFunctionAdapter {
  public config: AWSConfig
  public logger: Logger

  constructor (config: AWSConfig) {
    this.logger = new Logger('AWS')

    if (!config) config = {}

    this.config = config
  }
  invokeCloudFunction: (name: string, data: any, options?: any) => Promise<void>
  invokeSyncCloudFunction: <TResult>(name: string, data: any, options?: any) => Promise<TResult>

  /**
   * 部署
   * @param type {string} 发布类型
   * @param data {object} 部署环境配置
   * @param config {Logger} 部署对象配置
   */
  public async deploy (type: 'cloud_function' | 'http', data: DeployData, config: { [key: string]: any }): Promise<void> {
    switch (type) {
      case 'cloud_function':
        await deployLambda(data, config)
    }
  }
}
