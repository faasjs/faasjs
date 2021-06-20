import { join, sep } from 'path';
import Tencentcloud from '../..';

jest.mock('@faasjs/request', function () {
  return async function (url, options): Promise<any> {
    console.log('mock.request', url, options);
    switch (options.headers['X-TC-Action']) {
      case 'DescribeServicesStatus':
        return Promise.resolve({ body: { Response: { Result: { ServiceSet: [] } } } });
      case 'CreateService':
        return Promise.resolve({ body: { Response: { data: { ServiceId: 'ServiceId' } } } });
      case 'DescribeApisStatus':
        return Promise.resolve({ body: { Response: { Result: { ApiIdStatusSet: [] } } } });
      case 'CreateApi':
        return Promise.resolve({ body: { Response: {} } });
      case 'ReleaseService':
        return Promise.resolve({ body: { Response: {} } });
      default:
        return Promise.resolve({ body: { Response: { Error: 'Unknown mock' } } });
    }
  };
});

test('frist deploy', async function () {
  const tc = new Tencentcloud({
    secretId: 'secretId',
    secretKey: 'secretKey',
    region: 'region'
  });

  await tc.deploy('http', {
    root: __dirname,
    filename: join(__dirname, '..', 'funcs', 'http.func.ts'),
    env: 'testing',
    name: 'http',
    version: 'version',
    tmp: join(__dirname, '..', 'tmp', 'first') + sep,
    dependencies: { '@faasjs/func': '*' }
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
    config: {}
  });

  expect(true).toBeTruthy();
}, 10000);
