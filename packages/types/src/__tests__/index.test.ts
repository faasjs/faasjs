import { useFunc } from '@faasjs/func'
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
import { assertType, describe, expectTypeOf, it } from 'vitest'

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

describe('FaasActionUnionType', () => {
  it('be string', () => {
    assertType<FaasActionUnionType>('')
    expectTypeOf<FaasAction<string>>().toEqualTypeOf('')
    expectTypeOf<FaasParams<string>>().toEqualTypeOf({} as Record<string, any>)
    expectTypeOf<FaasData<string>>().toEqualTypeOf({} as Record<string, any>)
  })

  it('be key of FaasActions', () => {
    assertType<FaasActionUnionType>('/test')
    expectTypeOf<FaasAction<'test'>>().toEqualTypeOf('test' as const)
    expectTypeOf<FaasParams<'test'>>().toEqualTypeOf({ key: '' })
    expectTypeOf<FaasData<'test'>>().toEqualTypeOf({ value: '' })
  })

  it('be Record<string, any>', () => {
    type Test = {
      a: string
    }
    assertType<FaasActionUnionType>({})
    expectTypeOf<FaasAction<Test>>().toEqualTypeOf('')
    expectTypeOf<FaasParams<Test>>().toEqualTypeOf({} as Record<string, any>)
    expectTypeOf<FaasData<Test>>().toEqualTypeOf({ a: '' })
  })

  it('FaasActions', () => {
    assertType<FaasActions['test']['Params']>({ key: 'key' })
    assertType<FaasActions['test']['Data']>({ value: 'value' })
  })

  it('FaasEvent', () => {
    assertType<FaasEvents['test']>({ params: { key: 'key' } })
    expectTypeOf<FaasEvent<'test'>>().toEqualTypeOf<{
      params?: {
        key: string
      }
    }>()
    expectTypeOf<FaasEvent<'unknown'>>().toEqualTypeOf<Record<string, any>>()
  })

  it('InferFaasAction', () => {
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
})
