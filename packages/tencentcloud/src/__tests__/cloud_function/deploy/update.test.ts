import { join, sep } from 'path'
import { Provider } from '../../..'

jest.mock('child_process', () => ({ execSync() {} }))

jest.mock('cos-nodejs-sdk-v5', () => {
  return class Client {
    headBucket(params: any, callback: any) {
      console.log('mock.cos.headBucket', params)
      callback()
    }

    sliceUploadFile(params: any, callback: any) {
      console.log('mock.cos.sliceUploadFile', params)
      callback()
    }

    deleteObject(params: any, callback: any) {
      console.log('mock.cos.deleteObject', params)
      callback()
    }
  }
})

jest.mock('@faasjs/request', () => {
  return {
    request: async (url: string, options: any): Promise<any> => {
      console.log('mock.request', url, options)
      switch (options.headers['X-TC-Action']) {
        case 'DescribeServicesStatus':
          return Promise.resolve({
            body: {
              Response: {
                Result: {
                  ServiceSet: [
                    {
                      ServiceName: 'testing',
                      ServiceId: 'serviceId',
                    },
                  ],
                },
              },
            },
          })
        case 'ListNamespaces':
          return Promise.resolve({
            body: { Response: { Namespaces: [{ Name: 'testing' }] } },
          })
        case 'GetFunction':
          return Promise.resolve({
            body: {
              Response: {
                Status: 'Active',
                Triggers: [],
              },
            },
          })
        case 'UpdateFunctionCode':
        case 'UpdateFunctionConfiguration':
        case 'GetAlias':
        case 'UpdateAlias':
          return Promise.resolve({ body: { Response: {} } })
        case 'PublishVersion':
          return Promise.resolve({
            body: { Response: { FunctionVersion: '1' } },
          })
        case 'ListTriggers':
          return Promise.resolve({ body: { Response: { Triggers: [] } } })
        case 'GetProvisionedConcurrencyConfig':
          return Promise.resolve({ body: { Response: { Allocated: [] } } })
        default:
          return Promise.resolve({
            body: { Response: { Error: 'Unknown mock' } },
          })
      }
    },
  }
})

test('update', async () => {
  // const tc = new Provider({
  //   appId: 'appId',
  //   secretId: 'secretId',
  //   secretKey: 'secretKey',
  //   region: 'region'
  // })
  // await tc.deploy('cloud_function', {
  //   root: __dirname,
  //   filename: join(__dirname, '..', '..', 'funcs', 'basic.func.ts'),
  //   env: 'testing',
  //   name: 'basic',
  //   version: 'version',
  //   tmp: join(__dirname, '..', 'tmp', 'update') + sep,
  //   dependencies: { '@faasjs/func': '*' },
  //   config: {}
  // }, {
  //   name: 'cloud_function',
  //   provider: {
  //     type: '@faasjs/tencentcloud',
  //     name: 'tencentcloud'
  //   },
  //   config: {
  //     name: 'name',
  //     memorySize: 64,
  //     timeout: 60
  //   }
  // })
  // expect(true).toBeTruthy()
})
