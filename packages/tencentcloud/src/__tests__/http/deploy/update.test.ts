import { join, sep } from 'path'
import { Provider } from '../../..'

jest.mock('child_process', function () {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  return { execSync () {} }
})

jest.mock('@faasjs/request', function () {
  return async function (url, options): Promise<any> {
    console.log('mock.request', url, JSON.stringify(options))
    switch (options.headers['X-TC-Action']) {
      case 'DescribeServicesStatus':
        return Promise.resolve({ body: { Response: { Result: { ServiceSet: [{ ServiceName: 'testing' }] } } } })
      case 'DescribeApisStatus':
        return Promise.resolve({ body: { Response: { Result: { ApiIdStatusSet: [{ Path: '/' }] } } } })
      case 'DescribeApi':
        return Promise.resolve({ body: { Response: { Result: { RequestConfig: {} } } } })
      case 'ModifyApi':
        return Promise.resolve({ body: { Response: {} } })
      case 'ReleaseService':
        return Promise.resolve({ body: { Response: {} } })
      default:
        return Promise.resolve({ body: { Response: { Error: 'Unknown mock' } } })
    }
  }
})

test('update', async function () {
  const tc = new Provider({
    secretId: 'secretId',
    secretKey: 'secretKey',
    region: 'region'
  })

  await tc.deploy('http', {
    root: __dirname,
    filename: join(__dirname, '..', '..', 'funcs', 'http.func.ts'),
    env: 'testing',
    name: 'http',
    version: 'version',
    tmp: join(__dirname, '..', 'tmp', 'first') + sep,
    dependencies: { '@faasjs/func': '*' },
    config: {}
  }, {
    name: 'http',
    provider: {
      type: '@faasjs/tencentcloud',
      name: 'tencentcloud',
      config: {
        secretId: 'secretId',
        secretKey: 'secretKey',
        region: 'region'
      }
    },
    config: { path: '/' }
  })

  expect(true).toBeTruthy()
}, 10000)
