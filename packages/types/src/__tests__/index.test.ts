import { defineApi, useFunc, z } from '@faasjs/core'
import type {
  FaasAction,
  FaasActions,
  FaasActionUnionType,
  FaasData,
  FaasEvent,
  FaasEvents,
  FaasParams,
  InferFaasAction,
} from '@faasjs/types'
import { assertType, expectTypeOf, test } from 'vitest'

declare module '@faasjs/types' {
  interface FaasActions {
    test: {
      Params: { key: string }
      Data: { value: string }
    }
  }

  interface FaasEvents {
    test: {
      params?: {
        key: string
      }
    }
  }
}

test('FaasActionUnionType should support plain string', () => {
  assertType<FaasActionUnionType>('')
  expectTypeOf<FaasAction<string>>().toEqualTypeOf('')
  expectTypeOf<FaasParams<string>>().toEqualTypeOf({} as Record<string, any>)
  expectTypeOf<FaasData<string>>().toEqualTypeOf({} as Record<string, any>)
})

test('FaasActionUnionType should support action keys', () => {
  assertType<FaasActionUnionType>('/test')
  expectTypeOf<FaasAction<'test'>>().toEqualTypeOf('test' as const)
  expectTypeOf<FaasParams<'test'>>().toEqualTypeOf({ key: '' })
  expectTypeOf<FaasData<'test'>>().toEqualTypeOf({ value: '' })
})

test('FaasActionUnionType should support plain object', () => {
  type Test = {
    a: string
  }
  assertType<FaasActionUnionType>({})
  expectTypeOf<FaasAction<Test>>().toEqualTypeOf('')
  expectTypeOf<FaasParams<Test>>().toEqualTypeOf({} as Record<string, any>)
  expectTypeOf<FaasData<Test>>().toEqualTypeOf({ a: '' })
})

test('FaasActions should expose Params and Data', () => {
  assertType<FaasActions['test']['Params']>({ key: 'key' })
  assertType<FaasActions['test']['Data']>({ value: 'value' })
})

test('FaasEvent should infer from FaasEvents map', () => {
  assertType<FaasEvents['test']>({ params: { key: 'key' } })
  expectTypeOf<FaasEvent<'test'>>().toEqualTypeOf<{
    params?: {
      key: string
    }
  }>()
  expectTypeOf<FaasEvent<'unknown'>>().toEqualTypeOf<Record<string, any>>()
})

test('InferFaasAction should infer from useFunc', () => {
  const func = useFunc<
    {
      params: { key: string }
    },
    unknown,
    { value: string }
  >(() => {
    return async ({ event }) => {
      return { value: event.params.key }
    }
  })

  type InferredAction = InferFaasAction<typeof func>

  assertType<InferredAction['Params']>({ key: 'key' })
  assertType<InferredAction['Data']>({ value: 'value' })
  expectTypeOf({ key: true }).not.toEqualTypeOf({ key: 'key' })
  expectTypeOf({ value: true }).not.toEqualTypeOf({ value: 'value' })
})

test('InferFaasAction should infer schema params from defineApi', () => {
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

  // @ts-expect-error key should be string
  assertType<InferredAction['Params']>({ key: 1 })
})
