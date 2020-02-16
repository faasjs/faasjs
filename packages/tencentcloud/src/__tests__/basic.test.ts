import Tencentcloud from '..';

describe('basic', function () {
  test('should work', async function () {
    const tc = new Tencentcloud({
      secretId: 'secretId',
      secretKey: 'secretKey',
      region: 'region'
    });
    

    await tc.deploy('cloud_function', {
      root: __dirname,
      filename: __dirname + '/funcs/basic.func.ts',
      env: 'testing',
      name: 'basic',
      version: 'version',
      tmp: __dirname + '/tmp/',
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
    });

    expect(true).toBeTruthy();
  });
});
