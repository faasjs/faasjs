import type { FaasActions } from '@faasjs/types'
import { assertType, expect, test } from 'vitest'

import type { Response as FaasResponse } from '../../browser'
import { FaasBrowserClient } from '../../browser'

declare module '@faasjs/types' {
  interface FaasActions {
    '/type': {
      Params: { key: string }
      Data: { value: string }
    }
  }
}

test('FaasBrowserClient.action should infer response data type', async () => {
  const client = new FaasBrowserClient('/')

  assertType<FaasResponse<FaasActions['/type']['Data']>>(
    await client.action('/type', { key: 'key' }),
  )
  assertType<string>(
    await client.action('/type', { key: 'key' }).then((res) => {
      if (!res.data) throw new Error('missing data')

      return res.data.value
    }),
  )
})

test('FaasBrowserClient.action should validate params by action path', () => {
  const client = new FaasBrowserClient('/')

  expect(client).toBeInstanceOf(FaasBrowserClient)

  // @ts-expect-error key should be string
  void client.action('/type', { key: 1 })
})
