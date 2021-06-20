import { Redis, useRedis } from '../index';
import { Func, useFunc } from '@faasjs/func';

describe('redis', function () {
  afterEach(async function () {
    await useRedis().quit();
  });

  it('config with code', async function () {
    const redis = new Redis();

    const func = new Func({
      plugins: [redis],
      async handler () {
        await redis.query('set', ['key', 'value']);
        return redis.query('get', ['key']);
      }
    });

    const handler = func.export().handler;

    expect(await handler({})).toEqual('value');
  });

  it('config with env', async function () {
    process.env.SECRET_REDIS_HOST = '127.0.0.1';

    const redis = new Redis();

    const func = new Func({
      plugins: [redis],
      async handler () {
        await redis.query('set', ['key', 'value']);
        return redis.query('get', ['key']);
      }
    });

    const handler = func.export().handler;

    expect(await handler({})).toEqual('value');
  });

  it('useRedis', async function () {
    const func = useFunc(function () {
      const redis1 = useRedis();
      return async function () {
        await redis1.query('set', ['key', 'redis1']);

        const redis2 = useRedis();
        await redis2.query('set', ['key', 'redis2']);

        return redis1.query('get', ['key']);
      };
    });

    expect(await func.export().handler({})).toEqual('redis2');
  });

  it('query error', async function () {
    const func = useFunc(function () {
      const redis = useRedis();
      return async function () {
        await redis.query('wrong', []);
      };
    });

    try {
      await func.export().handler({});
    } catch (error) {
      expect(error.message).toEqual('ERR unknown command `wrong`, with args beginning with: ');
    }
  });
});
