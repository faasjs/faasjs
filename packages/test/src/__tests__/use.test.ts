import { FuncWarper } from '../../src/index'

it('use', async () => {
  const funcA = new FuncWarper(require.resolve('./funcs/use-a.func.ts'))
  await funcA.mount()
  const funcB = new FuncWarper(require.resolve('./funcs/use-b.func.ts'))
  await funcB.mount()

  expect(await funcB.JSONhandler({})).toMatchObject({
    body: '{"error":{"message":"[params] b is required."}}',
  })
})
