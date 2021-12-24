/**
 * @jest-environment jsdom
 */
import { FaasActions } from '@faasjs/types'
import { FaasBrowserClient, Response as FaasResponse } from '..'
import { expectType } from 'tsd'

let request: {
  url?: string;
  method?: string;
  headers?: HeadersInit
} = {}

const defaultMock = async (url:RequestInfo, options: RequestInit) => {
  request = {
    url: url as string,
    method: options.method,
    headers: options.headers,
  }
  return Promise.resolve({
    status: 200,
    headers: new Map([['Content-Type', 'application/json']]),
    text: async () => Promise.resolve('{"data":{}}')
  }) as unknown as Promise<Response>
}

describe('client', function () {
  beforeEach(function () {
    request = {}

    window.fetch = jest.fn(defaultMock)
  })

  it('should work', async function () {
    const client = new FaasBrowserClient('/')
    const response = await client.action('')

    expect(client.defaultOptions).toEqual({})
    expect(request.url.substring(0, 4)).toEqual('/?_=')
    expect(request.method).toEqual('POST')
    expect(request.headers).toEqual({ 'Content-Type': 'application/json; charset=UTF-8' })
    expect(response.status).toEqual(200)
    expect(response.headers).toEqual({ 'Content-Type': 'application/json' })
    expect(response.data).toEqual({})
  })

  it('work with beforeRequest', async function () {
    const client = new FaasBrowserClient('/', {
      beforeRequest: async ({ options }) => {
        options.method = 'GET'
        options.headers = { 'Content-Type': 'plain/text; charset=UTF-8', }
      }
    })
    await client.action('')

    expect(request.url.substring(0, 4)).toEqual('/?_=')
    expect(request.method).toEqual('GET')
    expect(request.headers).toEqual({ 'Content-Type': 'plain/text; charset=UTF-8' })
  })

  it('when error', async function () {
    window.fetch = jest.fn(async (url:RequestInfo, options: RequestInit) => {
      request = {
        url: url as string,
        method: options.method,
        headers: options.headers,
      }
      return Promise.resolve({
        status: 500,
        headers: new Map(),
        text: async () => Promise.resolve('{"error":{"message":"no"}}')
      }) as unknown as Promise<Response>
    })

    const client = new FaasBrowserClient('/')

    await expect(client.action('')).rejects.toEqual(Error('no'))
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
  beforeEach(function () {
    request = {}

    window.fetch = jest.fn(defaultMock)
  })

  it('should work', async () => {
    const client = new FaasBrowserClient('/')

    expectType<FaasResponse<any>>(await client.action('/', {}))
    expectType<FaasResponse<{ value: number }>>(await client.action<{ value: number }>('/', {}))
    expectType<FaasResponse<FaasActions['/type']['Data']>>(await client.action('/type', { key: 'key' }))
    expectType<string>(await client.action('/type', { key: 'key' }).then(res => res.data.value))
  })
})
