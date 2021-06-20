import { join, sep } from 'path'
import Tencentcloud from '../..'

jest.mock('child_process', function () {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  return { execSync () {} }
})

jest.mock('cos-nodejs-sdk-v5', () => {
  return class Client {
    headBucket (params, callback) {
      console.log('mock.cos.headBucket', params)
      callback()
    }

    sliceUploadFile (params, callback) {
      console.log('mock.cos.sliceUploadFile', params)
      callback()
    }

    deleteObject (params, callback) {
      console.log('mock.cos.deleteObject', params)
      callback()
    }
  }
})

jest.mock('@faasjs/request', () => {
  return async function (url, params) {
    console.log('mock.request', url, params)
    let res
    switch (url) {
      case 'https://apigateway.tencentcloudapi.com/':
        switch (params.body.Action) {
          case 'DescribeServicesStatus':
            res = { body: '{"serviceStatusSet":[{"serviceName":"testing","serviceId":"serviceId"}]}' }
            break
          default:
            res = { body: '{"apiIdStatusSet":[{"apiId":"apiId","path":"/"}]}' }
            break
        }
        break
      case 'https://scf.tencentcloudapi.com/?':
        switch (params.body.Action) {
          case 'ListNamespaces':
            res = {
              body: {
                Response: {
                  Namespaces: [
                    { Name: 'testing' }
                  ]
                }
              }
            }
            break
          case 'GetFunction':
            res = {
              body: {
                Response: {
                  Status: 'Active',
                  Triggers: []
                }
              }
            }
            break
          case 'UpdateFunctionCode':
          case 'UpdateFunctionConfiguration':
          case 'GetAlias':
          case 'UpdateAlias':
            res = { body: { Response: {} } }
            break
          case 'PublishVersion':
            res = { body: { Response: { FunctionVersion: '1' } } }
            break
          case 'ListTriggers':
            res = { body: { Response: { Triggers: [] } } }
            break
          default:
            res = { body: { Response: { Error: 'Unknown mock' } } }
            break
        }
    }
    console.log('mock.response', res)
    return Promise.resolve(res)
  }
})

test('update deploy', async function () {
  const tc = new Tencentcloud({
    secretId: 'secretId',
    secretKey: 'secretKey',
    region: 'region'
  })

  await tc.deploy('cloud_function', {
    root: __dirname,
    filename: join(__dirname, '..', 'funcs', 'basic.func.ts'),
    env: 'testing',
    name: 'basic',
    version: 'version',
    tmp: join(__dirname, '..', 'tmp', 'update') + sep,
    dependencies: { '@faasjs/func': '*' }
  }, {
    name: 'cloud_function',
    provider: {
      type: '@faasjs/tencentcloud',
      name: 'tencentcloud',
      config: {
        secretId: 'secretId',
        secretKey: 'secretKey',
        region: 'region'
      }
    },
    config: {
      name: 'name',
      memorySize: 64,
      timeout: 60
    }
  })

  expect(true).toBeTruthy()
}, 10000)
