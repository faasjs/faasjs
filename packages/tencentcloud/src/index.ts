import { DeployData } from '@faasjs/func'
import { Logger } from '@faasjs/logger'
import { CloudFunctionAdapter } from '@faasjs/cloud_function'
import { deployCloudFunction } from './cloud_function/deploy'
import {
  invokeCloudFunction,
  invokeSyncCloudFunction,
} from './cloud_function/invoke'
import { deployHttp } from './http/deploy'

export { request } from './request'

/**
 * 云 API 配置项
 * 优先读取环境变量，如果没有则读取入参
 */
export type TencentcloudConfig = {
  appId?: string
  secretId?: string
  secretKey?: string
  region?: string
  token?: string
}

export class Provider implements CloudFunctionAdapter {
  public config: TencentcloudConfig
  public logger: Logger

  constructor(config: TencentcloudConfig) {
    this.logger = new Logger('Tencentcloud')

    if (!config) config = {}

    // 环境变量优先级最高
    if (process.env.TENCENTCLOUD_APPID)
      config.appId = process.env.TENCENTCLOUD_APPID
    if (process.env.TENCENTCLOUD_REGION)
      config.region = process.env.TENCENTCLOUD_REGION
    if (process.env.TENCENTCLOUD_SECRETID)
      config.secretId = process.env.TENCENTCLOUD_SECRETID
    if (process.env.TENCENTCLOUD_SECRETKEY)
      config.secretKey = process.env.TENCENTCLOUD_SECRETKEY
    if (process.env.TENCENTCLOUD_SESSIONTOKEN)
      config.token = process.env.TENCENTCLOUD_SESSIONTOKEN

    this.config = config
  }

  /**
   * 部署
   * @param type {string} 发布类型
   * @param data {object} 部署环境配置
   * @param config {Logger} 部署对象配置
   */
  public async deploy(
    type: 'cloud_function' | 'http',
    data: DeployData,
    config: { [key: string]: any }
  ): Promise<void> {
    if (!this.config.appId) throw Error('appId required')
    if (!this.config.region) throw Error('region required')
    if (!this.config.secretId) throw Error('secretId required')
    if (!this.config.secretKey) throw Error('secretKey required')

    switch (type) {
      case 'cloud_function':
        await deployCloudFunction(this, data, config)
        break
      case 'http':
        await deployHttp(this, data, config)
        break
      default:
        throw Error(`Unknown deploy type: ${type}`)
    }
  }

  public async invokeCloudFunction(
    name: string,
    data: {
      event: any
      context: any
    },
    options?: {
      [key: string]: any
    }
  ): Promise<void> {
    return invokeCloudFunction(this, name, data, options)
  }

  public async invokeSyncCloudFunction<TResult = any>(
    name: string,
    data: {
      event: any
      context: any
    },
    options?: {
      [key: string]: any
    }
  ): Promise<TResult> {
    return invokeSyncCloudFunction<TResult>(this, name, data, options)
  }
}
