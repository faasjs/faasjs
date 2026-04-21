import { defineApi, z } from '@faasjs/core'
import { assertType, expect, test } from 'vitest'

import { testApi } from '..'

test('testApi should infer body from defineApi schema', () => {
  const schema = z.object({
    name: z.string(),
    age: z.number().optional(),
  })

  const func = defineApi({
    schema,
    async handler({ params }) {
      return {
        ok: true,
        name: params.name,
        age: params.age,
      }
    },
  })

  const testedFunc = testApi(func)

  expect(testedFunc).toBeDefined()

  assertType<Parameters<typeof testedFunc>[0]>({ name: 'FaasJS' })
  assertType<Parameters<typeof testedFunc>[0]>({ name: 'FaasJS', age: 1 })
  assertType<Parameters<typeof testedFunc>[1]>({ path: '/hello' })
  assertType<Parameters<typeof testedFunc>[1]>({ session: { userId: '1' } })

  // @ts-expect-error name should be string
  void testedFunc({ name: 1 })

  // @ts-expect-error name is required by schema
  void testedFunc({})
})

test('testApi should keep wide body type without schema', () => {
  const func = defineApi({
    async handler() {
      return {
        ok: true,
      }
    },
  })

  const testedFunc = testApi(func)
  expect(testedFunc).toBeDefined()

  void testedFunc({ anything: 1 })
  void testedFunc('raw')
  void testedFunc(null)
})

test('testApi should expose bound ApiTester helpers', () => {
  const func = defineApi({
    async handler() {
      return {
        ok: true,
      }
    },
  })

  const testedFunc = testApi(func)
  expect(testedFunc).toBeDefined()

  assertType<Parameters<typeof testedFunc.JSONhandler>[0]>({ anything: 1 })
  void testedFunc.JSONhandler({ anything: 1 })
})
