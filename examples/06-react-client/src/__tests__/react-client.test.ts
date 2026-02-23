import { FaasReactClient, Response, setMock } from '@faasjs/react'
import { afterEach, describe, expect, it } from 'vitest'

describe('react client', () => {
  afterEach(() => {
    setMock(null)
  })

  it('calls faas action through client', async () => {
    setMock(async (action, params) => {
      return new Response({
        data: {
          action,
          params,
        },
      })
    })

    const client = FaasReactClient({
      baseUrl: '/api/',
    })

    const result = await client.faas('greeting/api/hello', {
      name: 'Mock',
    })

    expect(result.data).toEqual({
      action: 'greeting/api/hello',
      params: {
        name: 'Mock',
      },
    })
  })
})
