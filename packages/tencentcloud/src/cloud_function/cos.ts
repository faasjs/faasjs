import { Provider } from '..'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const cosSdk = require('cos-nodejs-sdk-v5')

export async function checkBucket (tc: Provider, params: { [key: string]: any }): Promise<any> {
  return await new Promise((resolve, reject) => {
    new cosSdk({
      SecretId: tc.config.secretId,
      SecretKey: tc.config.secretKey
    }).headBucket(params, function (err: any, data: any) {
      if (err) {
        console.error(err)
        reject(err)
      }
      resolve(data)
    })
  })
}

export async function createBucket (tc: Provider, params: { [key: string]: any }): Promise<any> {
  return await new Promise((resolve, reject) => {
    new cosSdk({
      SecretId: tc.config.secretId,
      SecretKey: tc.config.secretKey
    }).putBucket(params, function (err: any, data: any) {
      if (err) {
        console.error(err)
        reject(err)
      }
      resolve(data)
    })
  })
}

export async function upload (tc: Provider, params: { [key: string]: any }): Promise<any> {
  return await new Promise((resolve, reject) => {
    new cosSdk({
      SecretId: tc.config.secretId,
      SecretKey: tc.config.secretKey
    }).sliceUploadFile(params, function (err: any, data: any) {
      if (err) {
        console.error(err)
        reject(err)
      }
      resolve(data)
    })
  })
}

export async function remove (tc: Provider, params: { [key: string]: any }): Promise<any> {
  return await new Promise((resolve, reject) => {
    new cosSdk({
      SecretId: tc.config.secretId,
      SecretKey: tc.config.secretKey
    }).deleteObject(params, function (err: any, data: any) {
      if (err) {
        console.error(err)
        reject(err)
      }
      resolve(data)
    })
  })
}
