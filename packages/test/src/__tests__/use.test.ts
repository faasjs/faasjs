import { FuncWarpper } from '../../src/index';

test('use', async function () {
  const funcA = new FuncWarpper(require.resolve('./funcs/use-a.func'));
  await funcA.mount();
  const funcB = new FuncWarpper(require.resolve('./funcs/use-b.func'));
  await funcB.mount();

  expect(await funcB.JSONhandler({}))
    .toMatchObject({ body: '{"error":{"message":"[params] b is required."}}' });
});
