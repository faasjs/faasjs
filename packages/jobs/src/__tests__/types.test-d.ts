import type { FuncEventType } from '@faasjs/core'
import { assertType, expectTypeOf, test } from 'vitest'
import * as z from 'zod'

import { defineJob } from '../define_job'
import type { DefineJobParams } from '../types'

test('defineJob should infer params from schema', () => {
  const schema = z.object({
    name: z.string(),
    count: z.coerce.number(),
  })
  const job = defineJob({
    schema,
    async handler({ params }) {
      expectTypeOf(params).toEqualTypeOf<{
        name: string
        count: number
      }>()

      return params.name
    },
  })

  assertType<FuncEventType<typeof job>>({
    params: {
      name: 'FaasJS',
      count: '1',
    },
  })

  assertType<DefineJobParams<typeof schema>>({
    name: 'FaasJS',
    count: 1,
  })
})

test('defineJob should use empty params without schema', () => {
  const job = defineJob({
    async handler({ params }) {
      expectTypeOf(params).toEqualTypeOf<Record<string, never>>()

      return true
    },
  })

  assertType<FuncEventType<typeof job>>({
    params: {
      anything: 1,
    },
  })
})

test('defineJob cron params should follow schema', () => {
  defineJob({
    schema: z.object({
      name: z.string(),
    }),
    cron: [
      {
        expression: '* * * * *',
        params: {
          name: 'FaasJS',
        },
      },
    ],
    async handler({ params }) {
      return params.name
    },
  })

  defineJob({
    schema: z.object({
      name: z.string(),
    }),
    cron: [
      {
        expression: '* * * * *',
        params: {
          // @ts-expect-error name should be string
          name: 1,
        },
      },
    ],
    async handler({ params }) {
      return params.name
    },
  })

  defineJob({
    cron: [
      {
        expression: '* * * * *',
        params: {
          // @ts-expect-error params require a schema
          name: 'FaasJS',
        },
      },
    ],
    async handler() {
      return true
    },
  })
})
