import { TencentcloudConfig } from '..'
import { tc } from '../tc'

/**
 * 发出请求
 *
 * @param logger {Logger} 日志类实例
 * @param config {object} 服务商基本参数
 * @param config.region {string} 区域
 * @param config.secretId {string} secretId
 * @param config.secretKey {string} secretKey
 * @param params {object} 请求参数
 */
export async function api<TResult = any> (action: string, config: TencentcloudConfig, payload: {
  [key: string]: any
}): Promise<TResult> {
  return tc<TResult>(config, {
    service: 'apigateway',
    version: '2018-08-08',
    action,
    payload
  })
}
