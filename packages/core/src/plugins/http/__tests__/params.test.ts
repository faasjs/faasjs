import { streamToString } from '@faasjs/utils'
import { describe, expect, it } from 'vitest'

import { createHttpHandler } from './helpers'

describe('params', () => {
  const handler = createHttpHandler((data) => data.params)

  it.each([
    ['blank', {}, '{"data":{}}'],
    ['raw', { body: 'raw' }, '{"data":"raw"}'],
    [
      'queryString',
      {
        headers: { 'content-type': 'application/json' },
        queryString: { a: 'a' },
        body: JSON.stringify({
          a: 'b',
          b: 'b',
        }),
      },
      '{"data":{"a":"b","b":"b"}}',
    ],
    [
      'json',
      {
        headers: { 'content-type': 'application/json' },
        body: '{"key":true}',
      },
      '{"data":{"key":true}}',
    ],
    [
      'should remove internal underscore key from params',
      {
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          _: 'internal',
          key: 'value',
        }),
      },
      '{"data":{"key":"value"}}',
    ],
  ])('%s', async (_, event, body) => {
    const res = await handler(event)

    expect(res.statusCode).toEqual(200)
    expect(await streamToString(res.body)).toEqual(body)
  })

  it('should return 400 when json body parse fails', async () => {
    const res = await handler({
      headers: { 'content-type': 'application/json' },
      queryString: { fromQuery: 'yes' },
      body: '{not-json',
    })

    expect(res.statusCode).toEqual(400)
    expect(await streamToString(res.body)).toEqual(
      '{"error":{"message":"Invalid JSON request body"}}',
    )
  })

  it('skips params parsing outside api runtime', async () => {
    const handler = createHttpHandler(
      (data) => {
        return {
          params: data.event.params,
          parsedParams: data.params ?? null,
          runtime: data.context.runtime,
          hasHttpHelpers: typeof data.setBody === 'function',
        }
      },
      {
        func: { runtime: 'job' },
      },
    )

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
    const handler = createHttpHandler(
      (data) => {
        return {
          params: data.params,
          runtime: data.context.runtime,
        }
      },
      {
        func: { runtime: 'api' },
      },
    )

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
    expect(await streamToString(res.body)).toEqual(
      '{"data":{"params":{"message":"parsed"},"runtime":"api"}}',
    )
  })
})
