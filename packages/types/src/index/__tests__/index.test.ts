import { defineApi, Func } from '@faasjs/core'
import type { FaasActions, InferFaasApi, InferFaasAction } from '@faasjs/types'
import { z } from '@faasjs/utils'
import { assertType, expectTypeOf, it } from 'vitest'

declare module '@faasjs/types' {
  interface FaasActions {
    test: {
      Params: { key: string }
      Data: { value: string }
    }
  }
}

it('FaasActions should expose Params and Data', () => {
  assertType<FaasActions['test']['Params']>({ key: 'key' })
  assertType<FaasActions['test']['Data']>({ value: 'value' })
})

it('InferFaasAction should infer from Func', () => {
  const func = new Func<
    {
      params: { key: string }
    },
    unknown,
    { value: string }
  >({
    async handler({ event }) {
      return { value: event.params.key }
    },
  })

  type InferredAction = InferFaasAction<typeof func>

  assertType<InferredAction['Params']>({ key: 'key' })
  assertType<InferredAction['Data']>({ value: 'value' })
  expectTypeOf({ key: true }).not.toEqualTypeOf({ key: 'key' })
  expectTypeOf({ value: true }).not.toEqualTypeOf({ value: 'value' })
})

it('InferFaasAction should infer schema params from defineApi', () => {
  const schema = z.object({
    key: z.string(),
    count: z.number().optional(),
  })

  const func = defineApi({
    schema,
    async handler({ params }) {
      return {
        value: params.key,
      }
    },
  })

  type InferredAction = InferFaasAction<typeof func>

  assertType<InferredAction['Params']>({ key: 'key' })
  assertType<InferredAction['Params']>({ key: 'key', count: 1 })

  assertType<InferredAction['Data']>({ value: '' })
})

it('InferFaasApi should infer the default export', () => {
  const api = defineApi({
    schema: z.object({
      slug: z.string(),
    }),
    async handler({ params }) {
      return {
        slug: params.slug,
      }
    },
  })

  type InferredApi = InferFaasApi<{
    default: typeof api
  }>

  assertType<InferFaasAction<InferredApi>['Params']>({ slug: 'post' })
})

it('InferFaasApi should reject modules without a default export', () => {
  const api = defineApi({
    schema: z.object({
      id: z.string(),
    }),
    async handler({ params }) {
      return {
        id: params.id,
      }
    },
  })

  expectTypeOf<InferFaasApi<{ api: typeof api }>>().toEqualTypeOf<never>()
})
