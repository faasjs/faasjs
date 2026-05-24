import { beforeEach, describe, expect, it, vi } from 'vitest'

import { faas } from '../../faas'
import { FaasReactClient, Response, setMock } from '../../index'

declare module '@faasjs/types' {
  interface FaasActions {
    'faas/test': {
      Params: { v?: number; id?: number }
      Data: number | { v: number }
    }
  }
}

describe('faas', () => {
  beforeEach(() => {
    setMock(null)
  })

  it('should use the active client mock', async () => {
    let current = 0

    FaasReactClient()
    setMock(() => Promise.resolve(new Response({ data: ++current })))

    expect(await faas('faas/test', {}, { baseUrl: '/' })).toMatchObject({ data: 1 })
  })

  it('should route requests through the client selected by baseUrl', async () => {
    const requests: {
      marker: string | undefined
      requestId: string | undefined
      url: string
    }[] = []

    const request = async (url: string, options: any) => {
      requests.push({
        marker: options.headers['X-Test-Marker'],
        requestId: options.headers['X-FaasJS-Request-Id'],
        url,
      })

      return new Response({
        data: {
          url,
          requestId: options.headers['X-FaasJS-Request-Id'],
          marker: options.headers['X-Test-Marker'],
        },
      })
    }

    FaasReactClient({
      baseUrl: '/faas-base/',
      options: {
        request,
      },
    })

    const response = await faas(
      'faas/test',
      { id: 1 },
      {
        baseUrl: '/faas-base/',
        headers: {
          'X-Test-Marker': 'selected-client',
        },
      },
    )

    if (!response.data) throw Error('response.data required')

    expect(requests).toHaveLength(1)
    expect(requests[0]).toMatchObject({
      marker: 'selected-client',
    })
    expect(response.data).toMatchObject({
      marker: 'selected-client',
    })
    expect((response.data as unknown as { url: string }).url).toContain('/faas-base/faas/test?_=')
    expect((response.data as unknown as { requestId: string }).requestId).toMatch(/^F-/)
  })

  it('should call onError before rejecting failed requests', async () => {
    const onError = vi.fn<() => any>(() => async () => {
      throw new Error('handled-error')
    })

    FaasReactClient({
      baseUrl: '/faas-error/',
      options: {
        request: async () => {
          throw new Error('request failed')
        },
      },
      onError,
    })

    await expect(faas('faas/test', { id: 1 }, { baseUrl: '/faas-error/' })).rejects.toThrow(
      'handled-error',
    )

    expect(onError).toHaveBeenCalledWith('faas/test', { id: 1 })
  })
})
