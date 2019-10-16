import { Func } from '@faasjs/func';
import { Http } from '../index';

describe('params', function () {
  test('blank', async function () {
    const http = new Http();
    const handler = new Func({
      plugins: [http],
      handler () {
        return http.headers;
      }
    }).export().handler;

    const res = await handler({});

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual('{"data":{}}');
  });

  test('should work', async function () {
    const http = new Http();
    const handler = new Func({
      plugins: [http],
      handler () {
        return http.headers;
      }
    }).export().handler;

    const res = await handler({
      headers: {
        key: 'value'
      }
    });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual('{"data":{"key":"value"}}');
  });
});
