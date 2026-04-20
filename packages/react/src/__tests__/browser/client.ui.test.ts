import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
  FaasBrowserClient,
  Response as FaasResponse,
  type Response,
  ResponseError,
} from '../../browser'

let request: {
  url: string
  method: string
  headers?: HeadersInit
} = {
  url: '',
  method: '',
}

function formatRequestUrl(url: RequestInfo | URL): string {
  if (typeof url === 'string') return url
  if (url instanceof URL) return url.toString()

  return url.url
}

const defaultMock = async (url: RequestInfo | URL, options: RequestInit) => {
  request = {
    url: formatRequestUrl(url),
    method: options.method ?? '',
    ...(options.headers ? { headers: options.headers } : {}),
  }
  return Promise.resolve({
    status: 200,
    headers: new Map([['Content-Type', 'application/json']]),
    text: async () => Promise.resolve('{"data":{}}'),
  }) as unknown as Promise<Response>
}

describe('client', () => {
  beforeEach(() => {
    request = {
      url: '',
      method: '',
    }

    window.fetch = vi.fn<typeof defaultMock>(defaultMock) as any
  })

  it('should work', async () => {
    const client = new FaasBrowserClient()
    const response = await client.action('path')

    expect(client.defaultOptions).toEqual({})
    expect(request.url.substring(0, 8)).toEqual('/path?_=')
    expect(request.method).toEqual('POST')
    expect(request.headers).toMatchObject({
      'Content-Type': 'application/json; charset=UTF-8',
    })
    expect(response.status).toEqual(200)
    expect(response.headers).toMatchObject({
      'Content-Type': 'application/json',
    })
    expect(response.data).toEqual({})
  })

  it('work with beforeRequest', async () => {
    const client = new FaasBrowserClient('/', {
      beforeRequest: async ({ options }) => {
        options.method = 'GET'
        options.headers = { 'Content-Type': 'plain/text; charset=UTF-8' }
      },
    })
    await client.action('path')

    expect(request.url.substring(0, 8)).toEqual('/path?_=')
    expect(request.method).toEqual('GET')
    expect(request.headers).toMatchObject({
      'Content-Type': 'plain/text; charset=UTF-8',
    })
  })

  it('work with request', async () => {
    const resData: FaasResponse = new FaasResponse({
      status: 200,
      headers: {},
      body: {},
      data: {},
    })

    const client = new FaasBrowserClient('/', {
      request: (_, options) => {
        return new Promise((resolve, reject) => {
          if (JSON.parse(options.body as any).success) resolve(resData)
          else reject('error')
        })
      },
    })

    const response = await client.action('/success', { success: true })

    expect(response.data).toEqual(response.data)
    await expect(client.action('/error', { success: false })).rejects.toEqual('error')
  })

  it('when error', async () => {
    window.fetch = vi.fn<typeof defaultMock>(
      async (url: RequestInfo | URL, options: RequestInit) => {
        request = {
          url: formatRequestUrl(url),
          method: options.method ?? '',
          ...(options.headers ? { headers: options.headers } : {}),
        }
        return Promise.resolve({
          status: 500,
          headers: new Map(),
          text: async () => Promise.resolve('{"error":{"message":"no"}}'),
        }) as unknown as Promise<Response>
      },
    ) as any

    const client = new FaasBrowserClient('/')

    await expect(client.action('path')).rejects.toEqual(new ResponseError('no'))
  })

  it('returns an empty wrapped response when success status has no body', async () => {
    window.fetch = vi.fn<typeof defaultMock>(
      async () =>
        Promise.resolve({
          status: 204,
          headers: new Map([['X-Empty', 'true']]),
          text: async () => Promise.resolve(''),
        }) as unknown as Promise<Response>,
    ) as any

    const client = new FaasBrowserClient('/')
    const response = await client.action('path')

    expect(response.status).toBe(204)
    expect(response.headers).toMatchObject({
      'X-Empty': 'true',
    })
    expect(response.data).toBeUndefined()
  })

  it('wraps non-JSON error responses in ResponseError', async () => {
    window.fetch = vi.fn<typeof defaultMock>(
      async () =>
        Promise.resolve({
          status: 503,
          headers: new Map([['Content-Type', 'text/plain']]),
          text: async () => Promise.resolve('service unavailable'),
        }) as unknown as Promise<Response>,
    ) as any

    const client = new FaasBrowserClient('/')

    await expect(client.action('path')).rejects.toMatchObject({
      message: 'service unavailable',
      status: 503,
      body: 'service unavailable',
    })
  })
})
