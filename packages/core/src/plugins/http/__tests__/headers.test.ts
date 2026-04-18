import { Http, Func } from '@faasjs/core'
import { streamToString } from '@faasjs/utils'
import { describe, expect, it } from 'vitest'

describe('params', () => {
  it('blank', async () => {
    const http = new Http({ config: { cookie: { session: { secret: 'test-secret' } } } })
    const handler = new Func({
      plugins: [http],
      async handler(data) {
        return data.headers
      },
    }).export().handler

    const res = await handler({})

    expect(res.statusCode).toEqual(200)
    expect(res.body).toBeInstanceOf(ReadableStream)
    expect(await streamToString(res.body)).toEqual('{"data":{}}')
  })

  it('should work', async () => {
    const http = new Http({ config: { cookie: { session: { secret: 'test-secret' } } } })
    const handler = new Func({
      plugins: [http],
      async handler(data) {
        return data.headers
      },
    }).export().handler

    const res = await handler({ headers: { key: 'value' } })

    expect(res.statusCode).toEqual(200)
    expect(res.body).toBeInstanceOf(ReadableStream)
    expect(await streamToString(res.body)).toEqual('{"data":{"key":"value"}}')
  })
})
