import { Func } from '@faasjs/func';
import { CosSecrets } from '../index';

jest.mock('cos-nodejs-sdk-v5', () => {
  return class Client {
    getObject (_, callback): void {
      callback(null, {
        Body: JSON.stringify({
          a: 1,
          b: { a: 1 } 
        }) 
      });
    }
  };
});

it('should work', async function () {
  const handler = new Func({
    plugins: [new CosSecrets()],
    handler () {
      return process.env;
    }
  }).export().handler;

  const res = await handler({});

  expect(res.SECRET_A).toEqual('1');
  expect(res.SECRET_B_A).toEqual('1');
});
