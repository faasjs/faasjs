import { expect, it } from 'vitest'

import { FuncWarper, streamToObject, test as createTester } from '../../index'
import { func } from './funcs/basic.func'

it('basic', async () => {
  const testedFunc = new FuncWarper(func)
  const res = await testedFunc.handler<any>({}, {})

  expect(res.statusCode).toEqual(200)
  expect(await streamToObject(res.body)).toEqual({
    data: true,
  })
})

it('test helper should bind handlers', async () => {
  const testedFunc = createTester(func)
  const detachedHandler = testedFunc.handler.bind(testedFunc)
  const res = await detachedHandler<any>({}, {})

  expect(res.statusCode).toEqual(200)
  expect(await streamToObject(res.body)).toEqual({
    data: true,
  })
})
