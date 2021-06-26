import { tc } from '../tc'

/**
 * 发出请求
 *
 * @param config {object} 服务商基本参数
 * @param config.region {string} 区域
 * @param config.secretId {string} secretId
 * @param config.secretKey {string} secretKey
 * @param params {object} 请求参数
 */
export async function scf<TResult = any> (action: string, provider: {
  secretId: string
  secretKey: string
  region: string
}, payload: {
  [key: string]: any
}): Promise<TResult> {
  return tc<TResult>({
    region: provider.region,
    service: 'scf',
    version: '2018-04-16',
    action,
    payload,
    secretId: provider.secretId,
    secretKey: provider.secretKey
  })
}
