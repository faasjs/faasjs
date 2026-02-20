import { streamToString } from '@faasjs/dev'
import { Func } from '..'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { Http } from '../index'

describe('params', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('blank', async () => {
    const http = new Http()
    const handler = new Func({
      plugins: [http],
      async handler() {
        return http.params
      },
    }).export().handler

    const res = await handler({})

    expect(res.statusCode).toEqual(200)
    expect(res.body).toBeInstanceOf(ReadableStream)
    expect(await streamToString(res.body as ReadableStream)).toEqual('{"data":{}}')
  })

  it('raw', async () => {
    const http = new Http<{ body: string }>()
    const handler = new Func({
      plugins: [http],
      async handler() {
        return http.params
      },
    }).export().handler

    const res = await handler({ body: 'raw' })

    expect(res.statusCode).toEqual(200)
    expect(res.body).toBeInstanceOf(ReadableStream)
    expect(await streamToString(res.body as ReadableStream)).toEqual('{"data":"raw"}')
  })

  it('queryString', async () => {
    const http = new Http()
    const handler = new Func({
      plugins: [http],
      async handler() {
        return http.params
      },
    }).export().handler

    const res = await handler({
      headers: { 'content-type': 'application/json' },
      queryString: { a: 'a' },
      body: JSON.stringify({
        a: 'b',
        b: 'b',
      }),
    })

    expect(res.statusCode).toEqual(200)
    expect(res.body).toBeInstanceOf(ReadableStream)
    expect(await streamToString(res.body as ReadableStream)).toEqual('{"data":{"a":"b","b":"b"}}')
  })

  it('json', async () => {
    const http = new Http()
    const handler = new Func({
      plugins: [http],
      async handler() {
        return http.params
      },
    }).export().handler

    const res = await handler({
      headers: { 'content-type': 'application/json' },
      body: '{"key":true}',
    })

    expect(res.statusCode).toEqual(200)
    expect(res.body).toBeInstanceOf(ReadableStream)
    expect(await streamToString(res.body as ReadableStream)).toEqual('{"data":{"key":true}}')
  })

  it('should keep query params when json body parse fails', async () => {
    const http = new Http()
    const handler = new Func({
      plugins: [http],
      async handler() {
        return http.params
      },
    }).export().handler

    const res = await handler({
      headers: { 'content-type': 'application/json' },
      queryString: { fromQuery: 'yes' },
      body: '{not-json',
    })

    expect(res.statusCode).toEqual(200)
    expect(res.body).toBeInstanceOf(ReadableStream)
    expect(await streamToString(res.body as ReadableStream)).toEqual('{"data":{"fromQuery":"yes"}}')
  })

  it('should remove internal underscore key from params', async () => {
    const http = new Http()
    const handler = new Func({
      plugins: [http],
      async handler() {
        return http.params
      },
    }).export().handler

    const res = await handler({
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        _: 'internal',
        key: 'value',
      }),
    })

    expect(res.statusCode).toEqual(200)
    expect(res.body).toBeInstanceOf(ReadableStream)
    expect(await streamToString(res.body as ReadableStream)).toEqual('{"data":{"key":"value"}}')
  })

  it('should fallback to original params when structuredClone throws', async () => {
    const cloneMock = vi.spyOn(globalThis, 'structuredClone').mockImplementation(() => {
      throw Error('clone not supported')
    })

    const http = new Http()
    const handler = new Func({
      plugins: [http],
      async handler(data) {
        return {
          sameReference: http.params === data.event.params,
          params: http.params,
        }
      },
    }).export().handler

    const res = await handler({
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ key: 'value' }),
    })

    expect(res.statusCode).toEqual(200)
    expect(res.body).toBeInstanceOf(ReadableStream)
    expect(await streamToString(res.body as ReadableStream)).toEqual(
      '{"data":{"sameReference":true,"params":{"key":"value"}}}',
    )
    expect(cloneMock).toHaveBeenCalled()
  })
})
