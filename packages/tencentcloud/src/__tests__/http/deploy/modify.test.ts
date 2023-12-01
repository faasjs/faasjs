import { join, sep } from 'path'
import { Provider } from '../../..'

jest.mock('@faasjs/request', () => ({
  request: async (url: string, options: any): Promise<any> => {
    console.log('mock.request', url, JSON.stringify(options))
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
      case 'DescribeApisStatus':
        return Promise.resolve({
          body: {
            Response: { Result: { ApiIdStatusSet: [{ Path: '=/' }] } },
          },
        })
      case 'DescribeApi':
        return Promise.resolve({ body: { Response: { Result: {} } } })
      case 'ModifyApi':
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

test('update', async () => {
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
      filename: join(__dirname, '..', '..', 'funcs', 'http.func.ts'),
      env: 'testing',
      name: 'http',
      version: 'version',
      tmp: join(__dirname, '..', 'tmp', 'first') + sep,
      dependencies: { '@faasjs/func': '*' },
      config: {},
    },
    {
      name: 'http',
      provider: {
        type: '@faasjs/tencentcloud',
        name: 'tencentcloud',
      },
      config: { path: '/' },
    }
  )

  expect(true).toBeTruthy()
})
