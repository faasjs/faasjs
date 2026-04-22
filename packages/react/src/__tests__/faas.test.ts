import type { FaasActionUnionType, FaasData } from '@faasjs/types'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { FaasReactClient, Response, setMock } from '..'
import { faas } from '../faas'

describe('faas', () => {
  beforeEach(() => {
    setMock(null)
  })

  it('should use the active client mock', async () => {
    let current = 0

    FaasReactClient()
    setMock(() => Promise.resolve(new Response({ data: ++current })))

    expect(await faas('t', {}, { baseUrl: '/' })).toMatchObject({ data: 1 })
  })

  it('should route requests through the client selected by baseUrl', async () => {
    const requests: {
      marker: string | undefined
      requestId: string | undefined
      url: string
    }[] = []

    const request = async <PathOrData extends FaasActionUnionType>(url: string, options: any) => {
      requests.push({
        marker: options.headers['X-Test-Marker'],
        requestId: options.headers['X-FaasJS-Request-Id'],
        url,
      })

      return new Response<FaasData<PathOrData>>({
        data: {
          url,
          requestId: options.headers['X-FaasJS-Request-Id'],
          marker: options.headers['X-Test-Marker'],
        } as FaasData<PathOrData>,
      })
    }

    FaasReactClient({
      baseUrl: '/faas-base/',
      options: {
        request,
      },
    })

    const response = await faas(
      'Hello',
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
    expect(response.data.url).toContain('/faas-base/hello?_=')
    expect(response.data.requestId).toMatch(/^F-/)
  })

  it('should call onError before rejecting failed requests', async () => {
    const onError = vi.fn(() => async () => {
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

    await expect(faas('broken', { id: 1 }, { baseUrl: '/faas-error/' })).rejects.toThrow(
      'handled-error',
    )

    expect(onError).toHaveBeenCalledWith('broken', { id: 1 })
  })
})
