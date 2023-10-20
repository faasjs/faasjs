import { TencentcloudConfig } from '..'
import { request } from '../request'

export async function api<TResult = any>(
  action: string,
  config: TencentcloudConfig,
  payload: {
    [key: string]: any
  }
): Promise<TResult> {
  return request<TResult>({
    ...config,
    service: 'apigateway',
    version: '2018-08-08',
    action,
    payload,
  })
}
