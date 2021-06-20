import { join, sep } from 'path';
import Tencentcloud from '../..';

jest.mock('cos-nodejs-sdk-v5', () => {
  return class Client {
    headBucket (params, callback): void {
      console.log('mock.cos.headBucket', params);
      callback(Error('no bucket'));
    }

    putBucket (params, callback): void {
      console.log('mock.cos.putBucket', params);
      callback();
    }

    sliceUploadFile (params, callback): void {
      console.log('mock.cos.sliceUploadFile', params);
      callback();
    }

    deleteObject (params, callback): void {
      console.log('mock.cos.deleteObject', params);
      callback();
    }
  };
});

jest.mock('@faasjs/request', () => {
  let functionCreated = false;
  return async function (url, params): Promise<any> {
    console.log('mock.request', url, params);
    let res;
    switch (url) {
      case 'https://scf.tencentcloudapi.com/?':
        switch (params.body.Action) {
          case 'ListNamespaces':
            res = { body: { Response: { Namespaces: [] } } };
            break;
          case 'GetFunction':
            if (functionCreated)
              res = {
                body: {
                  Response: {
                    Status: 'Active',
                    Triggers: []
                  }
                }
              };
            else
              res = {
                body: {
                  Response: {
                    Error: {
                      Code: 'ResourceNotFound.FunctionName',
                      Message: 'ResourceNotFound.FunctionName'
                    }
                  }
                }
              };
            
            break;
          case 'GetAlias':
            res = {
              body: {
                Response: {
                  Error: {
                    Code: 'ResourceNotFound.Alias',
                    Message: 'ResourceNotFound.Alias'
                  }
                }
              }
            };
            break;
          case 'CreateAlias':
            res = { body: { Response: {} } };
            break;
          case 'CreateNamespace':
            res = { body: { Response: {} } };
            break;
          case 'CreateFunction':
            functionCreated = true;
            res = { body: { Response: {} } };
            break;
          case 'UpdateAlias':
            res = { body: { Response: {} } };
            break;
          case 'PublishVersion':
            res = { body: { Response: { FunctionVersion: '1' } } };
            break;
          case 'ListTriggers':
            res = { body: { Response: { Triggers: [] } } };
            break;
          default:
            res = { body: { Response: { Error: 'Unknown mock' } } };
            break;
        }
    }
    console.log('mock.response', res);
    return Promise.resolve(res);
  };
});

test('frist deploy', async function () {
  const tc = new Tencentcloud({
    secretId: 'secretId',
    secretKey: 'secretKey',
    region: 'region'
  });

  await tc.deploy('cloud_function', {
    root: __dirname,
    filename: join(__dirname, '..', 'funcs', 'basic.func.ts'),
    env: 'testing',
    name: 'basic',
    version: 'version',
    tmp: join(__dirname, '..', 'tmp', 'first') + sep,
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
}, 10000);
