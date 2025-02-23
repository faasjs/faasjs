import { expect, it } from 'vitest'
import { FuncWarper } from '../../src/index'
import { func } from './funcs/basic.func'

it('basic', async () => {
  const testedFunc = new FuncWarper(func)
  const res = await testedFunc.handler<boolean>({}, {})

  expect(res).toEqual(true)
})
