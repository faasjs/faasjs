import { Func } from '@faasjs/func';
import { Http } from '../index';

describe('http', function () {
  test('should work', async function () {
    const http = new Http();
    const handler = new Func({
      plugins: [http],
      async handler () {
        return 1;
      }
    }).export().handler;

    const res = await handler({
      headers: {},
      body: null
    });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual('{"data":1}');
  });

  test('with config name', async function () {
    const http = new Http({ name: 'name' });
    const func = new Func({
      plugins: [http],
      async handler () {
        return 1;
      }
    });

    func.config = {
      providers: {},
      plugins: { name: { type: 'name' } }
    };
    const handler = func.export().handler;

    const res = await handler({
      headers: {},
      body: null
    });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual('{"data":1}');
  });

  test('throw error', async function () {
    const http = new Http();
    const handler = new Func({
      plugins: [http],
      async handler () {
        throw Error('wrong');
      }
    }).export().handler;

    const res = await handler({});

    expect(res.statusCode).toEqual(500);
    expect(res.body).toEqual('{"error":{"message":"wrong"}}');
  });

  test('beforeValid', async function () {
    const http = new Http({
      config: {
        async beforeValid (request) {
          if (!request.session.read('aid'))
            return {
              statusCode: 401,
              message: '请先登录'
            };
        }
      }
    });
    const handler = new Func({
      plugins: [http],
      async handler () {
        return 1;
      }
    }).export().handler;

    const res = await handler({
      headers: {},
      body: null
    });

    expect(res.statusCode).toEqual(401);
    expect(res.body).toEqual('{"error":{"message":"请先登录"}}');
  });
});
