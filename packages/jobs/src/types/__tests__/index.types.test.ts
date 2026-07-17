import type { FuncEventType } from '@faasjs/core'
import type { Client } from '@faasjs/pg'
import type { InferFaasJob } from '@faasjs/types'
import { z } from '@faasjs/utils'
import { assertType, expectTypeOf, it } from 'vitest'

import type { DefineJobParams, JobRecord } from '..'
import { defineJob } from '../../define-job'
import { enqueueJob } from '../../queue'

const typedJob = defineJob({
  schema: z.object({
    userId: z.string(),
    count: z.number().optional(),
  }),
  async handler({ params }) {
    return params.userId
  },
})

const emptyJob = defineJob({
  async handler() {},
})

declare module '@faasjs/types' {
  interface FaasJobs {
    'jobs/empty': InferFaasJob<typeof emptyJob>
    'jobs/typed': InferFaasJob<{
      default: typeof typedJob
    }>
  }
}

it('enqueueJob should use registered job paths and params', () => {
  expectTypeOf(enqueueJob('jobs/typed', { userId: 'u_123' })).toEqualTypeOf<Promise<JobRecord>>()
  void enqueueJob('jobs/typed', {
    userId: 'u_123',
    count: 1,
  })
  void enqueueJob('jobs/empty', {})
  void enqueueJob('jobs/typed', { userId: 'u_123' }, { client: {} as Client })

  // @ts-expect-error unknown job path
  void enqueueJob('jobs/unknown', {})
  // @ts-expect-error params are required
  void enqueueJob('jobs/typed')
  // @ts-expect-error userId is required
  void enqueueJob('jobs/typed', {})
  // @ts-expect-error userId must be a string
  void enqueueJob('jobs/typed', { userId: 1 })
  // @ts-expect-error jobs without a schema only accept empty params
  void enqueueJob('jobs/empty', { userId: 'u_123' })
})

it('defineJob should infer params from schema', () => {
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
      // @ts-expect-error
      count: '1',
    },
  })

  assertType<DefineJobParams<typeof schema>>({
    name: 'FaasJS',
    count: 1,
  })
})

it('defineJob should use empty params without schema', () => {
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

it('defineJob cron params should follow schema', () => {
  assertType(defineJob)
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
