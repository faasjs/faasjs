import { Http, Func } from '@faasjs/core'
import { test } from '@faasjs/dev'
import { describe, expect, it } from 'vitest'

describe('Accept-Encoding', () => {
  const data = '1'.repeat(1024)

  it('br', async () => {
    const func = test(
      new Func({
        plugins: [new Http({ config: { cookie: { session: { secret: 'test-secret' } } } })],
        async handler() {
          return data
        },
      }),
    )

    const res = await func.JSONhandler(null, {
      headers: { 'accept-encoding': 'br' },
    })

    expect(res.statusCode).toEqual(200)
    expect(res.headers['Content-Encoding']).toEqual('br')
    expect(res.data).toEqual(data)
  })

  it('gzip', async () => {
    const func = test(
      new Func({
        plugins: [new Http({ config: { cookie: { session: { secret: 'test-secret' } } } })],
        async handler() {
          return data
        },
      }),
    )

    const res = await func.JSONhandler(null, {
      headers: { 'accept-encoding': 'gzip' },
    })

    expect(res.statusCode).toEqual(200)
    expect(res.headers['Content-Encoding']).toEqual('gzip')
    expect(res.data).toEqual(data)
  })

  it('deflate', async () => {
    const func = test(
      new Func({
        plugins: [new Http({ config: { cookie: { session: { secret: 'test-secret' } } } })],
        async handler() {
          return data
        },
      }),
    )

    const res = await func.JSONhandler(null, {
      headers: { 'accept-encoding': 'deflate' },
    })

    expect(res.statusCode).toEqual(200)
    expect(res.headers['Content-Encoding']).toEqual('deflate')
    expect(res.data).toEqual(data)
  })

  it('unknown', async () => {
    const func = test(
      new Func({
        plugins: [new Http({ config: { cookie: { session: { secret: 'test-secret' } } } })],
        async handler() {
          return data
        },
      }),
    )

    const res = await func.JSONhandler(null, {
      headers: { 'accept-encoding': 'unknown' },
    })

    expect(res.statusCode).toEqual(200)
    expect(res.headers['Content-Encoding']).toBeUndefined()
    expect(res.data).toEqual(data)
  })

  it('direct response object body', async () => {
    const payload = { text: '1'.repeat(1024) }
    const func = test(
      new Func({
        plugins: [new Http({ config: { cookie: { session: { secret: 'test-secret' } } } })],
        async handler() {
          return {
            statusCode: 200,
            headers: { 'x-direct': '1' },
            body: payload,
          }
        },
      }),
    )

    const res = await func.JSONhandler(null, {
      headers: { 'accept-encoding': 'gzip' },
    })

    expect(res.statusCode).toEqual(200)
    expect(res.headers['Content-Encoding']).toEqual('gzip')
    expect(JSON.parse(res.body)).toEqual(payload)
  })
})
