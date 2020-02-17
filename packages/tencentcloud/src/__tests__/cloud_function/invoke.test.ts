import Tencentcloud from '../..';

jest.mock('@faasjs/request', () => {
  return async function (url, params): Promise<any> {
    console.log('mock.request', url, params);

    switch (params.body.FunctionName) {
      case 'invoke':
      case 'invokeSync':
        return Promise.resolve({
          body: {
            Response: {
              Result: {
                MemUsage: 0,
                Log: '',
                RetMsg: '{}',
                BillDuration: 0,
                FunctionRequestId: 'FunctionRequestId',
                Duration: 0,
                ErrMsg: '',
                InvokeResult: 0
              },
              RequestId: 'RequestId'
            }
          }
        });
      case 'invokeString':
        return Promise.resolve({
          body: {
            Response: {
              Result: {
                MemUsage: 0,
                Log: '',
                RetMsg: '',
                BillDuration: 0,
                FunctionRequestId: 'FunctionRequestId',
                Duration: 0,
                ErrMsg: '',
                InvokeResult: 0
              },
              RequestId: 'RequestId'
            }
          }
        });
      case 'invokeUnknown':
        return Promise.resolve({ body: { Response: { Result: {} } } });
      case 'invokeFail':
        return Promise.resolve({
          body: {
            Response: {
              Result: {
                MemUsage: 0,
                Log: '',
                RetMsg: '',
                BillDuration: 0,
                FunctionRequestId: 'FunctionRequestId',
                Duration: 0,
                ErrMsg: 'wrong',
                InvokeResult: 0
              },
              RequestId: 'RequestId'
            }
          }
        });
    }
  };
});

test('invokeCloudFunction', async function () {
  const tc = new Tencentcloud({
    secretId: 'secretId',
    secretKey: 'secretKey',
    region: 'region'
  });

  const res = await tc.invokeCloudFunction('invoke', {
    event: {},
    context: {} 
  });

  expect(res).toEqual({});
});

test('invokeSyncCloudFunction', async function () {
  const tc = new Tencentcloud({
    secretId: 'secretId',
    secretKey: 'secretKey',
    region: 'region'
  });

  const res = await tc.invokeSyncCloudFunction('invokeSync', {
    event: {},
    context: {} 
  });

  expect(res).toEqual({});
});

test('invokeSyncCloudFunction return string', async function () {
  const tc = new Tencentcloud({
    secretId: 'secretId',
    secretKey: 'secretKey',
    region: 'region'
  });

  const res = await tc.invokeSyncCloudFunction('invokeString', {
    event: {},
    context: {} 
  });

  expect(res).toEqual('');
});

test('invokeSyncCloudFunction unknown format', async function () {
  const tc = new Tencentcloud({
    secretId: 'secretId',
    secretKey: 'secretKey',
    region: 'region'
  });

  const res = await tc.invokeSyncCloudFunction('invokeUnknown', {
    event: {},
    context: {} 
  });

  expect(res).toEqual({ Result: {} });
});

test('invokeSyncCloudFunction failed', async function () {
  const tc = new Tencentcloud({
    secretId: 'secretId',
    secretKey: 'secretKey',
    region: 'region'
  });

  try {
    await tc.invokeSyncCloudFunction('invokeFail', {
      event: {},
      context: {} 
    });
  } catch (error) {
    expect(error.message).toEqual('wrong');
  }
});
