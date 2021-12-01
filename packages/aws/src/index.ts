import { DeployData } from '@faasjs/func'
import { Logger } from '@faasjs/logger'
import { CloudFunctionAdapter } from '@faasjs/cloud_function'
import { deployLambda } from './lambda'

export type AWSConfig = {
  accessKeyId?: string
  secretKey?: string
  region?: string
}

export class Provider implements CloudFunctionAdapter {
  public config: AWSConfig
  public logger: Logger

  constructor (config: AWSConfig) {
    this.logger = new Logger('AWS')

    if (!config) config = {}

    console.log(config)

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
        await deployLambda(this.config, data, config)
    }
  }
}
