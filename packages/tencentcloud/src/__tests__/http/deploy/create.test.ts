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

const requests: {
  [key: string]: any;
} = {}

jest.mock('@faasjs/request', function () {
  let functionCreated = false
  return {
    request: async function (url, options): Promise<any> {
      console.log('mock.request', url, options)
      requests[options.headers['X-TC-Action']] = options.body
      switch (options.headers['X-TC-Action']) {
        case 'ListNamespaces':
          return Promise.resolve({ body: { Response: { Namespaces: [] } } })
        case 'GetFunction':
          if (functionCreated)
            return Promise.resolve({
              body: {
                Response: {
                  Status: 'Active',
                  Triggers: []
                }
              }
            })
          else
            return Promise.resolve({
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
          return Promise.resolve({
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
          return Promise.resolve({ body: { Response: {} } })
        case 'CreateNamespace':
          return Promise.resolve({ body: { Response: {} } })
        case 'CreateFunction':
          functionCreated = true
          return Promise.resolve({ body: { Response: {} } })
        case 'UpdateAlias':
          return Promise.resolve({ body: { Response: {} } })
        case 'PublishVersion':
          return Promise.resolve({ body: { Response: { FunctionVersion: '1' } } })
        case 'ListTriggers':
          return Promise.resolve({ body: { Response: { Triggers: [] } } })
        case 'GetProvisionedConcurrencyConfig':
          return Promise.resolve({ body: { Response: { Allocated: [] } } })
        case 'DescribeServicesStatus':
          return Promise.resolve({ body: { Response: { Result: { ServiceSet: [] } } } })
        case 'CreateService':
          return Promise.resolve({
            body: {
              Response: {
                ServiceId: 'ServiceId',
                OuterSubDomain: 'domain'
              }
            }
          })
        case 'DescribeApisStatus':
          return Promise.resolve({ body: { Response: { Result: { ApiIdStatusSet: [] } } } })
        case 'CreateApi':
          return Promise.resolve({ body: { Response: {} } })
        case 'ReleaseService':
          return Promise.resolve({ body: { Response: {} } })
        default:
          return Promise.resolve({ body: { Response: { Error: 'Unknown mock' } } })
      }
    }
  }
})

test('create', async function () {
  const tc = new Provider({
    appId: 'appId',
    secretId: 'secretId',
    secretKey: 'secretKey',
    region: 'region'
  })

  await tc.deploy('cloud_function', {
    root: __dirname,
    filename: join(__dirname, '..', '..', 'funcs', 'http.func.ts'),
    env: 'testing',
    name: 'http',
    version: 'version',
    tmp: join(__dirname, '..', 'tmp', 'first') + sep,
    config: {},
    dependencies: { '@faasjs/func': '*' }
  }, {
    name: 'http',
    provider: {
      type: '@faasjs/tencentcloud',
      name: 'tencentcloud'
    },
    config: {}
  })

  await tc.deploy('http', {
    root: __dirname,
    filename: join(__dirname, '..', 'funcs', 'http.func.ts'),
    env: 'testing',
    name: 'http',
    version: 'version',
    tmp: join(__dirname, '..', 'tmp', 'first') + sep,
    config: {},
    dependencies: { '@faasjs/func': '*' }
  }, {
    name: 'http',
    provider: {
      type: '@faasjs/tencentcloud',
      name: 'tencentcloud'
    },
    config: {
      method: 'GET',
      timeout: 1,
      functionName: 'http',
      path: '/'
    }
  })

  expect(requests.CreateApi).toMatchObject({
    ApiName: 'http',
    EnableCORS: true,
    Protocol: 'HTTP',
    RequestConfig: {
      Method: 'GET',
      Path: '=/',
    },
    ServiceId: 'ServiceId',
    ServiceScfFunctionName: 'http',
    ServiceScfFunctionNamespace: 'testing',
    ServiceScfFunctionQualifier: 'testing',
    ServiceScfIsIntegratedResponse: true,
    ServiceTimeout: 1,
    ServiceType: 'SCF',
  })
  expect(requests.CreateFunction).toMatchObject({
    CfsConfig: undefined,
    ClsLogsetId: undefined,
    ClsTopicId: undefined,
    Code: {
      CosBucketName: 'scf',
      CosBucketRegion: 'region',
      CosObjectName: 'testing/http/version.zip',
    },
    CodeSource: undefined,
    DeadLetterConfig: undefined,
    Environment: {
      Variables: [
        {
          Key: 'FaasMode',
          Value: 'remote',
        },
        {
          Key: 'FaasEnv',
          Value: 'testing',
        },
        {
          Key: 'FaasLog',
          Value: 'debug',
        },
        {
          Key: 'NODE_ENV',
          Value: 'testing',
        },
      ],
    },
    FunctionName: 'http',
    Handler: 'index.handler',
    InitTimeout: undefined,
    Layers: undefined,
    MemorySize: 64,
    Namespace: 'testing',
    PublicNetConfig: undefined,
    Role: undefined,
    Runtime: 'Nodejs12.16',
    Timeout: 30,
    VpcConfig: undefined,
  })
  expect(requests.CreateNamespace).toMatchObject({ Namespace: 'testing' })
  expect(requests.CreateService).toMatchObject({
    Protocol: 'http&https',
    ServiceName: 'testing',
  })
  expect(requests.DescribeApisStatus).toMatchObject({
    Filters: [
      {
        Name: 'ApiName',
        Values: ['http', ],
      },
    ],
    ServiceId: 'ServiceId',
  })
  expect(requests.GetFunction).toMatchObject({
    FunctionName: 'http',
    Namespace: 'testing',
    Qualifier: '1',
  })
  expect(requests.ListNamespaces).toMatchObject({})
  expect(requests.ListTriggers).toMatchObject({
    FunctionName: 'http',
    Namespace: 'testing',
  })
  expect(requests.PublishVersion).toMatchObject({
    FunctionName: 'http',
    Namespace: 'testing',
  })
  expect(requests.ReleaseService).toMatchObject({
    EnvironmentName: 'release',
    ServiceId: 'ServiceId',
  })
})
