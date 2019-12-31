import { Redis } from '../index';
import { Func } from '@faasjs/func';

test('should work', async function () {
  const redis = new Redis();

  const func = new Func({
    plugins: [redis],
    async handler () {
      await redis.query('set', ['key', 'value']);
      return await redis.query('get', ['key']);
    }
  });

  func.config = {
    providers: {},
    plugins: {}
  };

  const handler = func.export().handler;

  expect(await handler({})).toEqual('value');

  redis.adapter.quit();
});
