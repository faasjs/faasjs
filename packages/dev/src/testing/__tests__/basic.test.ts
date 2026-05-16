import { ApiTester, testApi } from '@faasjs/dev'
import { streamToObject } from '@faasjs/utils'
import { expect, it } from 'vitest'

import basicApi from './apis/basic.api'

it('basic', async () => {
  const testedApi = new ApiTester(basicApi)
  const res = await testedApi.handler<any>({}, {})

  expect(testedApi.api).toBe(basicApi)
  expect(res.statusCode).toEqual(200)
  expect(await streamToObject(res.body)).toEqual({
    data: true,
  })
})

it('test helper should bind handlers', async () => {
  const testedApi = testApi(basicApi)
  const detachedHandler = testedApi.handler
  const res = await detachedHandler<any>({}, {})

  expect(testedApi.api).toBe(basicApi)
  expect(res.statusCode).toEqual(200)
  expect(await streamToObject(res.body)).toEqual({
    data: true,
  })
})
