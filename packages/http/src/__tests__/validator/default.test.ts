import { useFunc } from '@faasjs/func';
import { useHttp } from '../../index';

describe('validator/default', function () {
  describe('params', function () {
    describe('normal', function () {
      test('const', async function () {
        const handler = useFunc(function () {
          const http = useHttp({ validator: { params: { rules: { key: { default: 1 } } } } });
          return async function () {
            return http.params.key;
          };
        }).export().handler;

        const res = await handler({ httpMethod: 'POST' });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual('{"data":1}');
      });

      test('function', async function () {
        const handler = useFunc(function () {
          const http = useHttp({ validator: { params: { rules: { key: { default: (request) => request.params.i + 1 } } } } });
          return async function () {
            return http.params.key;
          };
        }).export().handler;

        const res = await handler({
          httpMethod: 'POST',
          headers: { 'content-type': 'application/json' },
          body: '{"i":1}'
        });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual('{"data":2}');
      });
    });

    describe('array', function () {
      test('const', async function () {
        const handler = useFunc(function () {
          const http = useHttp({ validator: { params: { rules: { key: { config: { rules: { sub: { default: 1 } } } } } } } });
          return async function () {
            return http.params.key;
          };
        }).export().handler;

        const res = await handler({
          httpMethod: 'POST',
          headers: { 'content-type': 'application/json' },
          body: '{"key":[{}]}'
        });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual('{"data":[{"sub":1}]}');
      });

      test('function', async function () {
        const handler = useFunc(function () {
          const http = useHttp({ validator: { params: { rules: { key: { config: { rules: { sub: { default: (request) => request.params.i + 1 } } } } } } } });
          return async function () {
            return http.params.key;
          };
        }).export().handler;

        const res = await handler({
          httpMethod: 'POST',
          headers: { 'content-type': 'application/json' },
          body: '{"key":[{}],"i":1}'
        });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual('{"data":[{"sub":2}]}');
      });
    });

    describe('object', function () {
      test('const', async function () {
        const handler = useFunc(function () {
          const http = useHttp({ validator: { params: { rules: { key: { config: { rules: { sub: { default: 1 } } } } } } } });
          return async function () {
            return http.params.key;
          };
        }).export().handler;

        const res = await handler({
          httpMethod: 'POST',
          headers: { 'content-type': 'application/json' },
          body: '{"key":{}}'
        });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual('{"data":{"sub":1}}');
      });

      test('function', async function () {
        const handler = useFunc(function () {
          const http = useHttp({ validator: { params: { rules: { key: { config: { rules: { sub: { default: (request) => request.params.i + 1 } } } } } } } });
          return async function () {
            return http.params.key;
          };
        }).export().handler;

        const res = await handler({
          httpMethod: 'POST',
          headers: { 'content-type': 'application/json' },
          body: '{"key":{},"i":1}'
        });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual('{"data":{"sub":2}}');
      });
    });
  });

  test('cookie should not work', async function () {
    const handler = useFunc(function () {
      const http = useHttp({ validator: { cookie: { rules: { key: { default: 1 } } } } });
      return async function () {
        return http.cookie.content;
      };
    }).export().handler;

    const res = await handler({ httpMethod: 'POST' });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual('{"data":{}}');
  });

  test('session should not work', async function () {
    const handler = useFunc(function () {
      const http = useHttp({ validator: { session: { rules: { key: { default: 1 } } } } });
      return async function () {
        return http.session.content;
      };
    }).export().handler;

    const res = await handler({
      httpMethod: 'POST',
      headers: { cookie: 'key=value' }
    });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual('{"data":{}}');
  });
});
