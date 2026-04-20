import { streamToObject } from '@faasjs/utils'
import { expect, it } from 'vitest'

import { ApiTester, test as createTester } from '../../index'
import basicApi from './funcs/basic.api'

it('basic', async () => {
  const testedApi = new ApiTester(basicApi)
  const res = await testedApi.handler<any>({}, {})

  expect(res.statusCode).toEqual(200)
  expect(await streamToObject(res.body)).toEqual({
    data: true,
  })
})

it('test helper should bind handlers', async () => {
  const testedApi = createTester(basicApi)
  const detachedHandler = testedApi.handler.bind(testedApi)
  const res = await detachedHandler<any>({}, {})

  expect(res.statusCode).toEqual(200)
  expect(await streamToObject(res.body)).toEqual({
    data: true,
  })
})
