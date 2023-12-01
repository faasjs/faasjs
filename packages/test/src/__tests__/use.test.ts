import { FuncWarper } from '../../src/index'

test('use', async () => {
  const funcA = new FuncWarper(require.resolve('./funcs/use-a.func'))
  await funcA.mount()
  const funcB = new FuncWarper(require.resolve('./funcs/use-b.func'))
  await funcB.mount()

  expect(await funcB.JSONhandler({})).toMatchObject({
    body: '{"error":{"message":"[params] b is required."}}',
  })
})
