import tc from '../tc';

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
export default async function (action: string, provider: {
  secretId: string
  secretKey: string
  region: string
}, payload: {
  [key: string]: any
}): Promise<any> {
  return tc({
    region: provider.region,
    service: 'apigateway',
    version: '2018-08-08',
    action,
    payload,
    secretId: provider.secretId,
    secretKey: provider.secretKey
  });
}
