import { FuncWarper } from '../../src/index'

it('basic', async () => {
  const func = new FuncWarper(await import('./funcs/basic.func'))
  const res = await func.handler<boolean>({}, {})

  expect(res).toEqual(true)
})
