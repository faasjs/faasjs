import { FuncWarper } from '../../src/index'
import UseA from './funcs/use-a.func'
import UseB from './funcs/use-b.func'

it('use', async () => {
  const funcA = new FuncWarper(UseA)
  await funcA.mount()
  const funcB = new FuncWarper(UseB)
  await funcB.mount()

  expect(await funcB.JSONhandler({})).toMatchObject({
    body: '{"error":{"message":"[params] b is required."}}',
  })
})
