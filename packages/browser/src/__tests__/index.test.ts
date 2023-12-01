/**
 * @jest-environment jsdom
 */
import { FaasActions } from '@faasjs/types'
import {
  FaasBrowserClient,
  Response as FaasResponse,
  Response,
  setMock,
} from '..'
import { expectType } from 'tsd'

let request: {
  url?: string
  method?: string
  headers?: HeadersInit
} = {}

const defaultMock = async (url: RequestInfo | URL, options: RequestInit) => {
  request = {
    url: url as any,
    method: options.method,
    headers: options.headers,
  }
  return Promise.resolve({
    status: 200,
    headers: new Map([['Content-Type', 'application/json']]),
    text: async () => Promise.resolve('{"data":{}}'),
  }) as unknown as Promise<Response>
}

describe('client', () => {
  beforeEach(() => {
    request = {}

    window.fetch = jest.fn(defaultMock) as any
  })

  it('should work', async () => {
    const client = new FaasBrowserClient('/')
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
      request: (url, options) => {
        return new Promise((resolve, reject) => {
          JSON.parse(options.body as any).success
            ? resolve(resData)
            : reject('error')
        })
      },
    })

    const response = await client.action('/success', { success: true })

    expect(response.data).toEqual(response.data)
    await expect(client.action('/error', { success: false })).rejects.toEqual(
      'error'
    )
  })

  it('when error', async () => {
    window.fetch = jest.fn(
      async (url: RequestInfo | URL, options: RequestInit) => {
        request = {
          url: url as string,
          method: options.method,
          headers: options.headers,
        }
        return Promise.resolve({
          status: 500,
          headers: new Map(),
          text: async () => Promise.resolve('{"error":{"message":"no"}}'),
        }) as unknown as Promise<Response>
      }
    ) as any

    const client = new FaasBrowserClient('/')

    await expect(client.action('path')).rejects.toEqual(Error('no'))
  })

  it('work with mock', async () => {
    setMock(
      async () =>
        new Response({
          status: 100,
          data: {},
        })
    )

    const client = new FaasBrowserClient('/')

    const response = await client.action('path')

    expect(response.status).toEqual(100)

    expect(response.data).toEqual({})

    setMock(undefined)
  })
})

declare module '@faasjs/types' {
  interface FaasActions {
    '/type': {
      Params: { key: string }
      Data: { value: string }
    }
  }
}

describe('types', () => {
  beforeEach(() => {
    request = {}

    window.fetch = jest.fn(defaultMock) as any
  })

  it('should work', async () => {
    const client = new FaasBrowserClient('/')

    expectType<FaasResponse<any>>(await client.action('/', {}))
    expectType<FaasResponse<{ value: number }>>(
      await client.action<{ value: number }>('/', {})
    )
    expectType<FaasResponse<FaasActions['/type']['Data']>>(
      await client.action('/type', { key: 'key' })
    )
    expectType<string>(
      await client.action('/type', { key: 'key' }).then(res => res.data.value)
    )
  })
})
