import { useFunc } from '@faasjs/func'
import type {
  FaasAction,
  FaasActions,
  FaasData,
  FaasParams,
  InferFaasAction,
} from '@faasjs/types'
import { expectNotType, expectType } from 'tsd'

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
    expectType<FaasAction>({})
    expectType<FaasAction>('/test')
    expectNotType<FaasAction>('/')
  })

  it('FaasParams', () => {
    expectType<FaasParams>({})
    expectType<FaasParams<'/test'>>({ key: 'key' })
    expectNotType<FaasParams<'/test'>>({ key: true })
  })

  it('FaasData', () => {
    expectType<FaasData>({})
    expectType<FaasData<'/test'>>({ value: 'value' })
    expectNotType<FaasData<'/test'>>({ value: true })
  })

  it('FaasActions', () => {
    expectType<FaasActions['/test']['Params']>({ key: 'key' })
    expectType<FaasActions['/test']['Data']>({ value: 'value' })
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

    expectType<InferredAction['Params']>({ key: 'key' })
    expectType<InferredAction['Data']>({ value: 'value' })
    expectNotType<InferredAction['Params']>({ key: true })
    expectNotType<InferredAction['Data']>({ value: true })
  })
})
