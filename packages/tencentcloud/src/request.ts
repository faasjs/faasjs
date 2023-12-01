import { createHash, createHmac } from 'crypto'
import { request as req, Response } from '@faasjs/request'
import { TencentcloudConfig } from '.'

/**
 * 腾讯云请求封装
 * @param config 配置项，若有环境变量优先读取环境变量
 * @param data 请求数据
 */
export async function request<T = any>({
  region,
  secretId,
  secretKey,
  token,
  service,
  version,
  action,
  payload,
}: TencentcloudConfig & {
  /**
   * 服务名
   * @example scf
   */
  service: string
  /**
   * 版本号
   * @example 2018-04-16
   */
  version: string
  /**
   * 操作名
   * @example Invoke
   */
  action: string
  /**
   * 请求数据
   */
  payload: {
    [key: string]: any
  }
}): Promise<T> {
  if (!region && process.env.TENCENTCLOUD_REGION)
    region = process.env.TENCENTCLOUD_REGION
  if (process.env.TENCENTCLOUD_SECRETID)
    secretId = process.env.TENCENTCLOUD_SECRETID
  if (process.env.TENCENTCLOUD_SECRETKEY)
    secretKey = process.env.TENCENTCLOUD_SECRETKEY
  if (process.env.TENCENTCLOUD_SESSIONTOKEN)
    token = process.env.TENCENTCLOUD_SESSIONTOKEN

  const host =
    process.env.TENCENTCLOUD_RUNENV === 'SCF'
      ? `${service}.internal.tencentcloudapi.com`
      : `${service}.tencentcloudapi.com`
  const canonicalRequest =
    `POST\n/\n\ncontent-type:application/json\nhost:${host}\n\ncontent-type;host\n` +
    createHash('sha256').update(JSON.stringify(payload)).digest('hex')

  const t = new Date()
  const timestamp = (Math.round(t.getTime() / 1000) - 1).toString()
  const date = t.toISOString().substr(0, 10)
  const credentialScope = date + `/${service}/tc3_request`

  const hashedCanonicalRequest = createHash('sha256')
    .update(canonicalRequest)
    .digest('hex')

  const stringToSign = `TC3-HMAC-SHA256\n${timestamp}\n${credentialScope}\n${hashedCanonicalRequest}`

  const secretDate = createHmac('sha256', `TC3${secretKey}`)
    .update(date)
    .digest()
  const secretService = createHmac('sha256', secretDate)
    .update(service)
    .digest()
  const secretSigning = createHmac('sha256', secretService)
    .update('tc3_request')
    .digest()
  const signature = createHmac('sha256', secretSigning)
    .update(stringToSign)
    .digest('hex')

  const authorization = `TC3-HMAC-SHA256 Credential=${secretId}/${credentialScope}, SignedHeaders=content-type;host, Signature=${signature}`

  const headers: {
    [key: string]: string
  } = {
    'Content-Type': 'application/json',
    Authorization: authorization,
    Host: host,
    'X-TC-Action': action,
    'X-TC-Version': version,
    'X-TC-Timestamp': timestamp,
  }

  if (region) headers['X-TC-Region'] = region
  if (token) headers['X-TC-Token'] = token

  return req<T>(`https://${host}/`, {
    method: 'POST',
    headers,
    body: payload,
  }).then((res: Response) => {
    if (res.body.Response.Error)
      return Promise.reject(
        Error(
          `${res.body.Response.Error.Code}: ${res.body.Response.Error.Message}`
        )
      )

    return res.body.Response
  })
}
