import { FuncWarpper } from '@faasjs/test';

describe('index', function () {
  test('should work', async function () {
    const func = new FuncWarpper(require.resolve('../index.func'));

    const { data } = await func.JSONhandler();

    expect(data).toEqual('Hello, world');
  });
});
