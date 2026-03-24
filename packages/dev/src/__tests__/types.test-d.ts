import { defineApi, z } from '@faasjs/core'
import { assertType, expect, test } from 'vitest'

import { test as wrap } from '../test'

test('JSONhandler should infer body from defineApi schema', () => {
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

  const testedFunc = wrap(func)

  expect(testedFunc).toBeDefined()

  assertType<Parameters<typeof testedFunc.JSONhandler>[0]>({ name: 'FaasJS' })
  assertType<Parameters<typeof testedFunc.JSONhandler>[0]>({ name: 'FaasJS', age: 1 })

  // @ts-expect-error name should be string
  void testedFunc.JSONhandler({ name: 1 })

  // @ts-expect-error name is required by schema
  void testedFunc.JSONhandler({})
})

test('JSONhandler should keep wide body type without schema', () => {
  const func = defineApi({
    async handler() {
      return {
        ok: true,
      }
    },
  })

  const testedFunc = wrap(func)
  expect(testedFunc).toBeDefined()

  void testedFunc.JSONhandler({ anything: 1 })
  void testedFunc.JSONhandler('raw')
  void testedFunc.JSONhandler(null)
})
