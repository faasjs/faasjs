import { Func } from '@faasjs/func';
import { Http } from '..';

describe('setHeader', function () {
  test('should work', async function () {
    const http = new Http();
    const handler = new Func({
      plugins: [http],
      handler () {
        http.setHeader('key', 'value');
      }
    }).export().handler;

    const res = await handler({});

    expect(res.statusCode).toEqual(201);
    expect(res.headers.key).toEqual('value');
  });
});
