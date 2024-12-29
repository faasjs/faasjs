import { Func } from '@faasjs/func'
import { describe, expect, it } from 'vitest'
import { Http } from '..'

describe('params', () => {
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
    expect(res.body).toEqual('{"data":{}}')
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
    expect(res.body).toEqual('{"data":"raw"}')
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
    expect(res.body).toEqual('{"data":{"a":"b","b":"b"}}')
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
    expect(res.body).toEqual('{"data":{"key":true}}')
  })
})
