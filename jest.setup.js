// jest.mock(__dirname + '/node_modules/cos-nodejs-sdk-v5');
jest.mock('cos-nodejs-sdk-v5', () => {
  return class Client {
    headBucket (params, callback) {
      console.log('mock.cos.headBucket', params);
      callback();
    }
    sliceUploadFile (params, callback) {
      console.log('mock.cos.sliceUploadFile', params);
      callback();
    }
    deleteObject (params, callback) {
      console.log('mock.cos.deleteObject', params);
      callback();
    }
  };
});

// jest.mock(__dirname + '/node_modules/@faasjs/request');
jest.mock('@faasjs/request', () => {
  return function (url, params) {
    console.log('mock.request', url, params);

    switch (url) {
      case 'https://apigateway.api.qcloud.com/v2/index.php?':
        switch (params.body.Action) {
          case 'DescribeServicesStatus':
            res = { body: '{"serviceStatusSet":[{"serviceName":"testing","serviceId":"serviceId"}]}' };
            break;
          default:
            res = { body: '{"apiIdStatusSet":[{"apiId":"apiId","path":"/"}]}' };
            break;
        }

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
            };
            break;
          case 'GetFunction':
            res = {
              body: {
                Response: {
                  Status: 'Active',
                  Triggers: []
                }
              }
            };
            break;
          case 'UpdateFunctionCode':
          case 'UpdateFunctionConfiguration':
          case 'GetAlias':
          case 'UpdateAlias':
            res = {
              body: {
                Response: {}
              }
            };
            break;
          case 'PublishVersion':
            res = {
              body: {
                Response: {
                  FunctionVersion: '1'
                }
              }
            };
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
