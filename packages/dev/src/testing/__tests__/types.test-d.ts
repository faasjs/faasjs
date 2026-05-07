import { defineApi } from '@faasjs/core'
import { assertType, expect, it } from 'vitest'
import * as z from 'zod'

import { testApi } from '../..'

it('testApi should infer body from defineApi schema', () => {
  const schema = z.object({
    name: z.string(),
    age: z.number().optional(),
  })

  const api = defineApi({
    schema,
    async handler({ params }) {
      return {
        ok: true,
        name: params.name,
        age: params.age,
      }
    },
  })

  const testedApi = testApi(api)

  expect(testedApi).toBeDefined()

  assertType<Parameters<typeof testedApi>[0]>({ name: 'FaasJS' })
  assertType<Parameters<typeof testedApi>[0]>({ name: 'FaasJS', age: 1 })
  assertType<Parameters<typeof testedApi>[1]>({ path: '/hello' })
  assertType<Parameters<typeof testedApi>[1]>({ session: { userId: '1' } })
})

it('testApi should keep wide body type without schema', () => {
  const api = defineApi({
    async handler() {
      return {
        ok: true,
      }
    },
  })

  const testedApi = testApi(api)
  expect(testedApi).toBeDefined()

  void testedApi({ anything: 1 })
  void testedApi('raw')
  void testedApi(null)
})

it('testApi should expose bound ApiTester helpers', () => {
  const api = defineApi({
    async handler() {
      return {
        ok: true,
      }
    },
  })

  const testedApi = testApi(api)
  expect(testedApi).toBeDefined()

  assertType<typeof api>(testedApi.api)
  assertType<Parameters<typeof testedApi.JSONhandler>[0]>({ anything: 1 })
  void testedApi.JSONhandler({ anything: 1 })
})
