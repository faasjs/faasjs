import { Func } from '@faasjs/func';
import { Http } from '../index';

describe('params', function () {
  test('blank', async function () {
    const http = new Http();
    const handler = new Func({
      plugins: [http],
      handler () {
        return http.params;
      }
    }).export().handler;

    const res = await handler({});

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual('{"data":{}}');
  });

  test('raw', async function () {
    const http = new Http();
    const handler = new Func({
      plugins: [http],
      handler () {
        return http.params;
      }
    }).export().handler;

    const res = await handler({
      body: 'raw'
    });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual('{"data":"raw"}');
  });

  test('queryString', async function () {
    const http = new Http();
    const handler = new Func({
      plugins: [http],
      handler () {
        return http.params;
      }
    }).export().handler;

    const res = await handler({
      queryString: {
        a: 'a'
      }
    });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual('{"data":{"a":"a"}}');
  });

  test('json', async function () {
    const http = new Http();
    const handler = new Func({
      plugins: [http],
      handler () {
        return http.params;
      }
    }).export().handler;

    const res = await handler({
      headers: {
        'content-type': 'application/json'
      },
      body: '{"key":true}'
    });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual('{"data":{"key":true}}');
  });
});
