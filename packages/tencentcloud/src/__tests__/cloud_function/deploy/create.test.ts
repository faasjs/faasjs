import { join, sep } from 'path'
import { Provider } from '../../..'

jest.mock('child_process', function () {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  return { execSync () {} }
})

jest.mock('cos-nodejs-sdk-v5', () => {
  return class Client {
    headBucket (params, callback): void {
      console.log('mock.cos.headBucket', params)
      callback(Error('no bucket'))
    }

    putBucket (params, callback): void {
      console.log('mock.cos.putBucket', params)
      callback()
    }

    sliceUploadFile (params, callback): void {
      console.log('mock.cos.sliceUploadFile', params)
      callback()
    }

    deleteObject (params, callback): void {
      console.log('mock.cos.deleteObject', params)
      callback()
    }
  }
})

jest.mock('@faasjs/request', () => {
  let functionCreated = false
  return async function (url, options): Promise<any> {
    console.log('mock.request', url, options)
    switch (options.headers['X-TC-Action']) {
      case 'ListNamespaces':
        return await Promise.resolve({ body: { Response: { Namespaces: [] } } })
      case 'GetFunction':
        if (functionCreated)
          return await Promise.resolve({
            body: {
              Response: {
                Status: 'Active',
                Triggers: []
              }
            }
          })
        else
          return await Promise.resolve({
            body: {
              Response: {
                Error: {
                  Code: 'ResourceNotFound.FunctionName',
                  Message: 'ResourceNotFound.FunctionName'
                }
              }
            }
          })
      case 'GetAlias':
        return await Promise.resolve({
          body: {
            Response: {
              Error: {
                Code: 'ResourceNotFound.Alias',
                Message: 'ResourceNotFound.Alias'
              }
            }
          }
        })
      case 'CreateAlias':
        return await Promise.resolve({ body: { Response: {} } })
      case 'CreateNamespace':
        return await Promise.resolve({ body: { Response: {} } })
      case 'CreateFunction':
        functionCreated = true
        return await Promise.resolve({ body: { Response: {} } })
      case 'UpdateAlias':
        return await Promise.resolve({ body: { Response: {} } })
      case 'PublishVersion':
        return await Promise.resolve({ body: { Response: { FunctionVersion: '1' } } })
      case 'ListTriggers':
        return await Promise.resolve({ body: { Response: { Triggers: [] } } })
      default:
        return await Promise.resolve({ body: { Response: { Error: 'Unknown mock' } } })
    }
  }
})

test('create', async function () {
  const tc = new Provider({
    secretId: 'secretId',
    secretKey: 'secretKey',
    region: 'region'
  })

  await tc.deploy('cloud_function', {
    root: __dirname,
    filename: join(__dirname, '..', '..', 'funcs', 'basic.func.ts'),
    env: 'testing',
    name: 'basic',
    version: 'version',
    tmp: join(__dirname, '..', 'tmp', 'first') + sep,
    config: {},
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
