import { join, sep } from 'path'
import { Provider } from '../../..'

jest.mock('child_process', () => ({ execSync() {} }))

jest.mock('cos-nodejs-sdk-v5', () => {
  return class Client {
    headBucket(params: any, callback: any): void {
      console.log('mock.cos.headBucket', params)
      callback(Error('no bucket'))
    }

    putBucket(params: any, callback: any): void {
      console.log('mock.cos.putBucket', params)
      callback()
    }

    sliceUploadFile(params: any, callback: any): void {
      console.log('mock.cos.sliceUploadFile', params)
      callback()
    }

    deleteObject(params: any, callback: any): void {
      console.log('mock.cos.deleteObject', params)
      callback()
    }
  }
})

jest.mock('@faasjs/request', () => {
  let functionCreated = false
  return {
    request: async (url: string, options: any): Promise<any> => {
      console.log('mock.request', url, options)
      switch (options.headers['X-TC-Action']) {
        case 'ListNamespaces':
          return Promise.resolve({ body: { Response: { Namespaces: [] } } })
        case 'GetFunction':
          if (functionCreated)
            return Promise.resolve({
              body: {
                Response: {
                  Status: 'Active',
                  Triggers: [],
                },
              },
            })

          return Promise.resolve({
            body: {
              Response: {
                Error: {
                  Code: 'ResourceNotFound.FunctionName',
                  Message: 'ResourceNotFound.FunctionName',
                },
              },
            },
          })
        case 'GetAlias':
          return Promise.resolve({
            body: {
              Response: {
                Error: {
                  Code: 'ResourceNotFound.Alias',
                  Message: 'ResourceNotFound.Alias',
                },
              },
            },
          })
        case 'CreateAlias':
          return Promise.resolve({ body: { Response: {} } })
        case 'CreateNamespace':
          return Promise.resolve({ body: { Response: {} } })
        case 'CreateFunction':
          functionCreated = true
          return Promise.resolve({ body: { Response: {} } })
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

test('create', async () => {
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
  //   tmp: join(__dirname, '..', 'tmp', 'first') + sep,
  //   config: {},
  //   dependencies: { '@faasjs/func': '*' }
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
