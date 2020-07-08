import { FuncWarpper } from '@faasjs/test';

describe('index', function () {
  test('should work', async function () {
    const func = new FuncWarpper(require.resolve('../index.func'));

    const res = await func.handler({});

    expect(res.body).toEqual('{"data":"Hello, world"}');
  });
});
