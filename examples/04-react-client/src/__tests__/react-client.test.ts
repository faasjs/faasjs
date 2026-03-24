import { FaasReactClient, Response, setMock } from '@faasjs/react'
import { describe, expect, it } from 'vite-plus/test'

describe('react client', () => {
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
