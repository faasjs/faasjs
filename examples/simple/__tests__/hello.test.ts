import { FuncWarpper } from '@faasjs/test';

describe('hello', function () {
  test('should work', async function () {
    const func = new FuncWarpper(require.resolve('../hello.func'));

    const res = await func.handler({});

    expect(res.body).toEqual('{"data":"Hello, world"}');
  });
});
