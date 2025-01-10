import { expect, it } from 'vitest'
import { FuncWarper } from '../../src/index'
import Func from './funcs/basic.func'

it('basic', async () => {
  const func = new FuncWarper(Func)
  const res = await func.handler<boolean>({}, {})

  expect(res).toEqual(true)
})
