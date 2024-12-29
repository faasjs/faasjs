import { useFunc } from '@faasjs/func'
import type {
  FaasAction,
  FaasActions,
  FaasData,
  FaasParams,
  InferFaasAction,
} from '@faasjs/types'
import { assertType, describe, expectTypeOf, it } from 'vitest'

declare module '@faasjs/types' {
  interface FaasActions {
    '/test': {
      Params: { key: string }
      Data: { value: string }
    }
  }
}

describe('types', () => {
  it('FaasAction', () => {
    assertType<FaasAction>({})
    assertType<FaasAction>('/test')
  })

  it('FaasParams', () => {
    assertType<FaasParams>({})
    assertType<FaasParams<'/test'>>({ key: 'key' })
  })

  it('FaasData', () => {
    assertType<FaasData>({})
    assertType<FaasData<'/test'>>({ value: 'value' })
    expectTypeOf({ value: true }).not.toEqualTypeOf({ value: 'value' })
  })

  it('FaasActions', () => {
    assertType<FaasActions['/test']['Params']>({ key: 'key' })
    assertType<FaasActions['/test']['Data']>({ value: 'value' })
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
