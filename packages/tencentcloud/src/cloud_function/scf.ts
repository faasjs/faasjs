import { TencentcloudConfig } from '..'
import { request } from '../request'

export async function scf<TResult = any>(
  action: string,
  config: TencentcloudConfig,
  payload: {
    [key: string]: any
  }
): Promise<TResult> {
  return request<TResult>({
    ...config,
    service: 'scf',
    version: '2018-04-16',
    action,
    payload,
  })
}
