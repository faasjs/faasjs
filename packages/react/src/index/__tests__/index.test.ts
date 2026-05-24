import { afterEach, describe, expect, it } from 'vitest'

import { Response, setMock } from '../../index'
import { FaasReactClient, getClient } from '../../index'

declare module '@faasjs/types' {
  interface FaasActions {
    'react/test': {
      Params: { v?: number; id?: number }
      Data: number | { v: number }
    }
  }
}

describe('FaasReactClient', () => {
  afterEach(() => {
    setMock(null)
  })

  it('should work', () => {
    const client = FaasReactClient()

    expect(client).toHaveProperty('faas')
    expect(client).toHaveProperty('useFaas')
    expect(client).toHaveProperty('FaasDataWrapper')

    expect(getClient('/')).toBe(client)
  })

  it('faas', async () => {
    setMock(async (action, params) => new Response({ data: { action, params } }))

    const client = FaasReactClient({
      baseUrl: '/api/',
    })

    const { data } = await client.faas('react/test', { v: 1 })

    expect(data).toEqual({ action: 'react/test', params: { v: 1 } })
  })
})
