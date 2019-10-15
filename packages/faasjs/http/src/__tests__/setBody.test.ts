import { Func } from '@faasjs/func';
import { Http } from '..';

describe('setBody', function () {
  test('should work', async function () {
    const http = new Http();
    const handler = new Func({
      plugins: [http],
      handler () {
        http.setBody('body');
      }
    }).export().handler;

    const res = await handler({});

    expect(res.body).toEqual('body');
  });
});
