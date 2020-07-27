import { createHash, createHmac } from 'crypto';
import request, { Response } from '@faasjs/request';

export default async function<T = any> ({
  region,
  service,
  version,
  action,
  payload,
  secretId,
  secretKey
}: {
  region: string;
  service: string;
  version: string;
  action: string;
  payload: any;
  secretId: string;
  secretKey: string;
}): Promise<T> {
  const canonicalRequest = `POST\n/\n\ncontent-type:application/json\nhost:${service}.tencentcloudapi.com\n\ncontent-type;host\n` +
  createHash('sha256').update(JSON.stringify(payload)).digest('hex');

  const t = new Date();
  const timestamp = Math.round(t.getTime() / 1000) + '';
  const date = t.toISOString().substr(0, 10);
  const credentialScope = date + `/${service}/tc3_request`;

  const hashedCanonicalRequest = createHash('sha256').update(canonicalRequest).digest('hex');

  const stringToSign = 'TC3-HMAC-SHA256\n' +
    timestamp + '\n' +
    credentialScope + '\n' +
    hashedCanonicalRequest;

  const secretDate = createHmac('sha256', 'TC3' + secretKey).update(date).digest();
  const secretService = createHmac('sha256', secretDate).update(service).digest();
  const secretSigning = createHmac('sha256', secretService).update('tc3_request').digest();
  const signature = createHmac('sha256', secretSigning).update(stringToSign).digest('hex');

  const authorization =
    'TC3-HMAC-SHA256 ' +
    'Credential=' + secretId + '/' + credentialScope + ', ' +
    'SignedHeaders=content-type;host, ' +
    'Signature=' + signature;

  return request<T>(`https://${service}.tencentcloudapi.com/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: authorization,
      Host: `${service}.tencentcloudapi.com`,
      'X-TC-Action': action,
      'X-TC-Version': version,
      'X-TC-Timestamp': timestamp,
      'X-TC-Region': region
    },
    body: payload
  }).then(function (res: Response) {
    if (res.body.Response.Error) {
      console.error(res.body);
      return Promise.reject(res.body.Response.Error);
    }

    return res.body.Response;
  });
}
