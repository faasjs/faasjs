import { TencentcloudConfig } from '..'
import { request } from '../request'

/**
 * 发出请求
 *
 * @param config {object} 服务商基本参数
 * @param config.region {string} 区域
 * @param config.secretId {string} secretId
 * @param config.secretKey {string} secretKey
 * @param params {object} 请求参数
 */
export async function scf<TResult = any> (action: string, config: TencentcloudConfig, payload: {
  [key: string]: any
}): Promise<TResult> {
  return request<TResult>(config, {
    service: 'scf',
    version: '2018-04-16',
    action,
    payload
  })
}
