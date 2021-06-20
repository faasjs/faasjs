import request, { Response } from '@faasjs/request';
import * as crypto from 'crypto';
import Tencentcloud from '..';

function mergeData (data: any, prefix: string = ''): { [key: string]: any } {
  const ret: any = {};
  for (const k in data) {
    if (typeof data[k] === 'undefined' || data[k] === null) continue;

    if (data[k] instanceof Array || data[k] instanceof Object) Object.assign(ret, mergeData(data[k], prefix + k + '.')); else ret[prefix + k] = data[k];
  }
  return ret;
}

function formatSignString (params: any): string {
  const str: string[] = [];

  for (const key of Object.keys(params).sort()) str.push(key + '=' + params[key]);

  return str.join('&');
}

const host = process.env.TENCENTCLOUD_RUNENV === 'SCF' ? 'scf.internal.tencentcloudapi.com' : 'scf.tencentcloudapi.com';

/**
 * 发出请求
 *
 * @param config {object} 服务商基本参数
 * @param config.region {string} 区域
 * @param config.secretId {string} secretId
 * @param config.secretKey {string} secretKey
 * @param params {object} 请求参数
 */
export default async function action (tc: Tencentcloud, params: { [key: string]: any }): Promise<any> {
  params = {
    Nonce: Math.round(Math.random() * 65535),
    Region: tc.config.region,
    SecretId: tc.config.secretId,
    SignatureMethod: 'HmacSHA256',
    Timestamp: Math.round(Date.now() / 1000) - 1,
    Version: '2018-04-16',
    ...params
  };
  params = mergeData(params);

  const sign = `POST${host}/?${formatSignString(params)}`;

  params.Signature = crypto.createHmac('sha256', tc.config.secretKey).update(sign).digest('base64');

  return request(`https://${host}/?`, {
    body: params,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    method: 'POST'
  }).then(function (res: Response) {
    if (res.body.Response.Error) return Promise.reject(res.body.Response.Error); else return res.body.Response;
  });
}
