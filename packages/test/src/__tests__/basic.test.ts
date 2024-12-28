import { FuncWarper } from '../../src/index'

it('basic', async () => {
  const func = new FuncWarper(require.resolve('./funcs/basic.func.ts'))
  const res = await func.handler<boolean>({}, {})

  expect(res).toEqual(true)
})
