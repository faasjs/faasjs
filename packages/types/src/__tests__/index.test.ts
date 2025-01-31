import { useFunc } from '@faasjs/func'
import type {
  FaasAction,
  FaasActionUnionType,
  FaasActions,
  FaasData,
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

  it('be react server action', () => {
    type TestServerAction = (params: { props: string }) => Promise<{ data: string }>
    assertType<FaasActionUnionType>(async () => { })
    expectTypeOf<FaasAction<TestServerAction>>().toEqualTypeOf(async (params: { props: string }) => ({ data: params.props }))
    expectTypeOf<FaasParams<TestServerAction>>().toEqualTypeOf({ props: '' })
    expectTypeOf<FaasData<TestServerAction>>().toEqualTypeOf({ data: '' })
  })

  it('FaasActions', () => {
    assertType<FaasActions['test']['Params']>({ key: 'key' })
    assertType<FaasActions['test']['Data']>({ value: 'value' })
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
