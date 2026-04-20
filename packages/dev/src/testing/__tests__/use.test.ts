import { expect, it } from 'vitest'

import { ApiTester } from '../../index'
import useAApi from './funcs/use-a.api'
import useBApi from './funcs/use-b.api'

it('use', async () => {
  const apiA = new ApiTester(useAApi)
  await apiA.mount()
  const apiB = new ApiTester(useBApi)
  await apiB.mount()

  expect(await apiB.JSONhandler({})).toMatchObject({
    body: '{"error":{"message":"[params] b is required."}}',
  })
})
