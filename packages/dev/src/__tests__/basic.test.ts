import { expect, it } from 'vitest'
import { FuncWarper, test as createTester } from '../../src/index'
import { func } from './funcs/basic.func'

it('basic', async () => {
  const testedFunc = new FuncWarper(func)
  const res = await testedFunc.handler<boolean>({}, {})

  expect(res).toEqual(true)
})

it('test helper should bind handlers', async () => {
  const testedFunc = createTester(func)
  const detachedHandler = testedFunc.handler

  await expect(detachedHandler<boolean>({}, {})).resolves.toBe(true)
})
