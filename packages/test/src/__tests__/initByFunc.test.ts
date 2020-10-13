import { Func, FuncWarpper } from '../../src/index';

test('init by func', async function () {
  const func = new Func({ async handler () { return true; } });
  const warper = new FuncWarpper(func);
  const res = await warper.handler({}, {});

  expect(res).toEqual(true);
});
