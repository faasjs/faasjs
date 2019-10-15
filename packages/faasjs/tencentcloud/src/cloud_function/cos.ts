import Tencentcloud from '..';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const cosSdk = require('cos-nodejs-sdk-v5');

export function checkBucket (this: Tencentcloud, params: any) {
  const client = new cosSdk({
    SecretId: this.config.secretId,
    SecretKey: this.config.secretKey,
  });

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

export function createBucket (this: Tencentcloud, params: any) {
  const client = new cosSdk({
    SecretId: this.config.secretId,
    SecretKey: this.config.secretKey,
  });

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

export function upload (this: Tencentcloud, params: any) {
  const client = new cosSdk({
    SecretId: this.config.secretId,
    SecretKey: this.config.secretKey,
  });

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

export function remove (this: Tencentcloud, params: any) {
  const client = new cosSdk({
    SecretId: this.config.secretId,
    SecretKey: this.config.secretKey,
  });

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
