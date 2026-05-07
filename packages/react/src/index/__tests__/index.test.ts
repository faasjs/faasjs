import { afterEach, describe, expect, it } from 'vitest'

import { Response, setMock } from '../../index'
import { FaasReactClient, getClient } from '../../index'

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

    // @ts-expect-error undeclared action
    const { data } = await client.faas('hello', { v: 1 })

    expect(data).toEqual({ action: 'hello', params: { v: 1 } })
  })
})
