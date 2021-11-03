import { Provider } from '..'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const cosSdk = require('cos-nodejs-sdk-v5')

function cos (tc: Provider) {
  return new cosSdk({
    SecretId: tc.config.secretId,
    SecretKey: tc.config.secretKey
  })
}

export async function checkBucket (tc: Provider, params: { [key: string]: any }): Promise<any> {
  return await new Promise((resolve, reject) => {
    cos(tc).headBucket(params, function (err: any, data: any) {
      if (err)
        reject(err)
      resolve(data)
    })
  })
}

export async function createBucket (tc: Provider, params: { [key: string]: any }): Promise<any> {
  return await new Promise((resolve, reject) => {
    cos(tc).putBucket(params, function (err: any, data: any) {
      if (err)
        reject(err)
      resolve(data)
    })
  })
}

export async function upload (tc: Provider, params: { [key: string]: any }): Promise<any> {
  return await new Promise((resolve, reject) => {
    cos(tc).sliceUploadFile(params, function (err: any, data: any) {
      if (err)
        reject(err)
      resolve(data)
    })
  })
}

export async function remove (tc: Provider, params: { [key: string]: any }): Promise<any> {
  return await new Promise((resolve, reject) => {
    cos(tc).deleteObject(params, function (err: any, data: any) {
      if (err)
        reject(err)
      resolve(data)
    })
  })
}
