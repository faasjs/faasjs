import { Func } from '@faasjs/func';
import { brotliCompressSync, deflateSync, gzipSync } from 'zlib';
import { Http } from '..';

describe('Accept-Encoding', function () {
  test('br', async function () {
    const http = new Http();
    const handler = new Func({
      plugins: [http],
      async handler () {
        return 1;
      }
    }).export().handler;

    const res = await handler({
      headers: { 'accept-encoding': 'br' },
      body: null
    });

    expect(res.isBase64Encoded).toBeTruthy();
    expect(res.headers['Content-Encoding']).toEqual('br');
    expect(res.originBody).toEqual('{"data":1}');
    expect(res.body).toEqual(brotliCompressSync('{"data":1}').toString('base64'));
  });

  test('gzip', async function () {
    const http = new Http();
    const handler = new Func({
      plugins: [http],
      async handler () {
        return 1;
      }
    }).export().handler;

    const res = await handler({
      headers: { 'accept-encoding': 'gzip' },
      body: null
    });

    expect(res.isBase64Encoded).toBeTruthy();
    expect(res.headers['Content-Encoding']).toEqual('gzip');
    expect(res.originBody).toEqual('{"data":1}');
    expect(res.body).toEqual(gzipSync('{"data":1}').toString('base64'));
  });

  test('deflate', async function () {
    const http = new Http();
    const handler = new Func({
      plugins: [http],
      async handler () {
        return 1;
      }
    }).export().handler;

    const res = await handler({
      headers: { 'accept-encoding': 'deflate' },
      body: null
    });

    expect(res.isBase64Encoded).toBeTruthy();
    expect(res.headers['Content-Encoding']).toEqual('deflate');
    expect(res.originBody).toEqual('{"data":1}');
    expect(res.body).toEqual(deflateSync('{"data":1}').toString('base64'));
  });

  test('unknown', async function () {
    const http = new Http();
    const handler = new Func({
      plugins: [http],
      async handler () {
        return 1;
      }
    }).export().handler;

    const res = await handler({
      headers: { 'accept-encoding': 'unknown' },
      body: null
    });

    expect(res.body).toEqual('{"data":1}');
  });
});
