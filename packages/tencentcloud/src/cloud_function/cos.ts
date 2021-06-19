import Tencentcloud from '..';

// eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
const cosSdk = require('cos-nodejs-sdk-v5');

export async function checkBucket (tc: Tencentcloud, params: { [key: string]: any; }): Promise<any> {
  const client = new cosSdk({
    SecretId: tc.config.secretId,
    SecretKey: tc.config.secretKey,
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  return new Promise((resolve, reject) => {
    client.headBucket(params, function (err: any, data: any) {
      if (err) {
        console.error(err);
        reject(err);
      }
      resolve(data);
    });
  });
}

export async function createBucket (tc: Tencentcloud, params: { [key: string]: any; }): Promise<any> {
  const client = new cosSdk({
    SecretId: tc.config.secretId,
    SecretKey: tc.config.secretKey,
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  return new Promise((resolve, reject) => {
    client.putBucket(params, function (err: any, data: any) {
      if (err) {
        console.error(err);
        reject(err);
      }
      resolve(data);
    });
  });
}

export async function upload (tc: Tencentcloud, params: { [key: string]: any; }): Promise<any> {
  const client = new cosSdk({
    SecretId: tc.config.secretId,
    SecretKey: tc.config.secretKey,
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  return new Promise((resolve, reject) => {
    client.sliceUploadFile(params, function (err: any, data: any) {
      if (err) {
        console.error(err);
        reject(err);
      }
      resolve(data);
    });
  });
}

export async function remove (tc: Tencentcloud, params: { [key: string]: any; }): Promise<any> {
  const client = new cosSdk({
    SecretId: tc.config.secretId,
    SecretKey: tc.config.secretKey,
  });

  // eslint-disable-next-line @typescript-eslint/typedef
  return new Promise((resolve, reject) => {
    client.deleteObject(params, function (err: any, data: any) {
      if (err) {
        console.error(err);
        reject(err);
      }
      resolve(data);
    });
  });
}
