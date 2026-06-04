import { Http, Func } from '@faasjs/core'
import { streamToString } from '@faasjs/utils'
import { describe, expect, it } from 'vitest'

describe('params', () => {
  it('blank', async () => {
    const http = new Http({ config: { cookie: { session: { secret: 'test-secret' } } } })
    const handler = new Func({
      plugins: [http],
      async handler(data) {
        return data.params
      },
    }).export().handler

    const res = await handler({})

    expect(res.statusCode).toEqual(200)
    expect(res.body).toBeInstanceOf(ReadableStream)
    expect(await streamToString(res.body as ReadableStream)).toEqual('{"data":{}}')
  })

  it('raw', async () => {
    const http = new Http<{ body: string }>({
      config: { cookie: { session: { secret: 'test-secret' } } },
    })
    const handler = new Func({
      plugins: [http],
      async handler(data) {
        return data.params
      },
    }).export().handler

    const res = await handler({ body: 'raw' })

    expect(res.statusCode).toEqual(200)
    expect(res.body).toBeInstanceOf(ReadableStream)
    expect(await streamToString(res.body as ReadableStream)).toEqual('{"data":"raw"}')
  })

  it('queryString', async () => {
    const http = new Http({ config: { cookie: { session: { secret: 'test-secret' } } } })
    const handler = new Func({
      plugins: [http],
      async handler(data) {
        return data.params
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
    const http = new Http({ config: { cookie: { session: { secret: 'test-secret' } } } })
    const handler = new Func({
      plugins: [http],
      async handler(data) {
        return data.params
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

  it('should return 400 when json body parse fails', async () => {
    const http = new Http({ config: { cookie: { session: { secret: 'test-secret' } } } })
    const handler = new Func({
      plugins: [http],
      async handler(data) {
        return data.params
      },
    }).export().handler

    const res = await handler({
      headers: { 'content-type': 'application/json' },
      queryString: { fromQuery: 'yes' },
      body: '{not-json',
    })

    expect(res.statusCode).toEqual(400)
    expect(res.body).toBeInstanceOf(ReadableStream)
    expect(await streamToString(res.body as ReadableStream)).toEqual(
      '{"error":{"message":"Invalid JSON request body"}}',
    )
  })

  it('should remove internal underscore key from params', async () => {
    const http = new Http({ config: { cookie: { session: { secret: 'test-secret' } } } })
    const handler = new Func({
      plugins: [http],
      async handler(data) {
        return data.params
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

  it('skips params parsing outside api runtime', async () => {
    const http = new Http({ config: { cookie: { session: { secret: 'test-secret' } } } })
    const handler = new Func({
      runtime: 'job',
      plugins: [http],
      async handler(data) {
        return {
          params: data.event.params,
          parsedParams: data.params ?? null,
          runtime: data.context.runtime,
          hasHttpHelpers: typeof data.setBody === 'function',
        }
      },
    }).export().handler

    const res = await handler({
      params: {
        message: 'keep',
      },
      queryString: {
        message: 'from-http',
      },
    })

    expect(res).toEqual({
      params: {
        message: 'keep',
      },
      parsedParams: null,
      runtime: 'job',
      hasHttpHelpers: false,
    })
  })

  it('uses configured api runtime over caller context runtime', async () => {
    const http = new Http({ config: { cookie: { session: { secret: 'test-secret' } } } })
    const handler = new Func({
      runtime: 'api',
      plugins: [http],
      async handler(data) {
        return {
          params: data.params,
          runtime: data.context.runtime,
        }
      },
    }).export().handler

    const res = await handler(
      {
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          message: 'parsed',
        }),
      },
      {
        runtime: 'job',
      },
    )

    expect(res.statusCode).toEqual(200)
    expect(res.body).toBeInstanceOf(ReadableStream)
    expect(await streamToString(res.body as ReadableStream)).toEqual(
      '{"data":{"params":{"message":"parsed"},"runtime":"api"}}',
    )
  })
})
