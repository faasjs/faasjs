import { FaasAction, FaasActions, FaasData, FaasParams } from '@faasjs/types'
import { expectType, expectNotType } from 'tsd'

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
})
