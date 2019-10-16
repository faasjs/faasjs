import { action } from '../commands/deploy';

describe('deploy', function () {
  jest.mock(process.cwd() + '/node_modules/cos-nodejs-sdk-v5', () => {
    return class Client {
      sliceUploadFile (params, callback) {
        callback();
      }
    };
  });

  jest.mock(process.cwd() + '/node_modules/@faasjs/request', () => {
    return async function () {
      return {
        statusCode: 200,
        headers: {
          'content-type': 'application/json'
        },
        body: {
          Response: {}
        }
      };
    };
  });

  test('a file', async function () {
    try {
      await action('testing', ['src/__tests__/funcs/basic.func.ts']);
    } catch (error) {
      expect(error.message).toEqual('Cannot read property \'find\' of undefined');
    }
  }, 30000);

  test('a folder', async function () {
    try {
      await action('testing', ['src/__tests__/funcs/']);
    } catch (error) {
      expect(error.message).toEqual('Cannot read property \'find\' of undefined');
    }
  }, 30000);
});
