import { Func } from '@faasjs/func';
import { Http, ContentType } from '..';

describe('setContentType', function () {
  test.each(Object.keys(ContentType))('type is %s', async function (type) {
    const http = new Http();
    const handler = new Func({
      plugins: [http],
      handler () {
        http.setContentType(type);
      }
    }).export().handler;

    const res = await handler({});

    expect(res.statusCode).toEqual(201);
    expect(res.headers['Content-Type']).toEqual(`${ContentType[type as string]}; charset=utf-8`);
  });

  test('set charset', async function () {
    const http = new Http();
    const handler = new Func({
      plugins: [http],
      handler () {
        http.setContentType('type', 'utf-16');
      }
    }).export().handler;

    const res = await handler({});

    expect(res.statusCode).toEqual(201);
    expect(res.headers['Content-Type']).toEqual('type; charset=utf-16');
  });
});
