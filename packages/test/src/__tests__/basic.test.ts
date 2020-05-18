import { FuncWarpper } from '../../src/index';

test('basic', async function () {
  const func = new FuncWarpper(require.resolve('./funcs/basic.func'));
  const res = await func.handler({}, {});

  expect(res).toEqual(true);
});
