import { Func } from '@faasjs/func';
import { Http } from '..';

describe('setStatusCode', function () {
  test('should work', async function () {
    const http = new Http();
    const handler = new Func({
      plugins: [http],
      handler () {
        http.setStatusCode(404);
      }
    }).export().handler;

    const res = await handler({});

    expect(res.statusCode).toEqual(404);
  });
});
