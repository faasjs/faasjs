import { join, sep } from 'path'
import { Provider } from '../../..'

const requests: {
  [key: string]: any
} = {}

jest.mock('@faasjs/request', () => ({
  request: async (url: string, options: any): Promise<any> => {
    console.log('mock.request', url, options)
    requests[options.headers['X-TC-Action']] = options.body
    switch (options.headers['X-TC-Action']) {
      case 'DescribeServicesStatus':
        return Promise.resolve({
          body: { Response: { Result: { ServiceSet: [] } } },
        })
      case 'CreateService':
        return Promise.resolve({
          body: {
            Response: {
              ServiceId: 'ServiceId',
              OuterSubDomain: 'domain',
            },
          },
        })
      case 'DescribeApisStatus':
        return Promise.resolve({
          body: { Response: { Result: { ApiIdStatusSet: [] } } },
        })
      case 'CreateApi':
        return Promise.resolve({ body: { Response: {} } })
      case 'ReleaseService':
        return Promise.resolve({ body: { Response: {} } })
      default:
        return Promise.resolve({
          body: { Response: { Error: 'Unknown mock' } },
        })
    }
  },
}))

test('create', async () => {
  const tc = new Provider({
    appId: 'appId',
    secretId: 'secretId',
    secretKey: 'secretKey',
    region: 'region',
  })

  await tc.deploy(
    'http',
    {
      root: __dirname,
      filename: join(__dirname, '..', 'funcs', 'http.func.ts'),
      env: 'testing',
      name: 'http',
      version: 'version',
      tmp: join(__dirname, '..', 'tmp', 'first') + sep,
      config: {},
      dependencies: { '@faasjs/func': '*' },
    },
    {
      name: 'http',
      provider: {
        type: '@faasjs/tencentcloud',
        name: 'tencentcloud',
      },
      config: {
        method: 'GET',
        timeout: 1,
        functionName: 'http',
        path: '/',
      },
    }
  )

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
  expect(requests.CreateService).toMatchObject({
    Protocol: 'http&https',
    ServiceName: 'testing',
  })
  expect(requests.DescribeApisStatus).toMatchObject({
    Filters: [
      {
        Name: 'ApiName',
        Values: ['http'],
      },
    ],
    ServiceId: 'ServiceId',
  })
  expect(requests.ReleaseService).toMatchObject({
    EnvironmentName: 'release',
    ServiceId: 'ServiceId',
  })
})
