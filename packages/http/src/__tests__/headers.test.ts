import { Func } from '@faasjs/func'
import { streamToString } from '@faasjs/dev'
import { describe, expect, it } from 'vitest'
import { Http } from '..'

describe('params', () => {
  it('blank', async () => {
    const http = new Http()
    const handler = new Func({
      plugins: [http],
      async handler() {
        return http.headers
      },
    }).export().handler

    const res = await handler({})

    expect(res.statusCode).toEqual(200)
    expect(res.body).toBeInstanceOf(ReadableStream)
    expect(await streamToString(res.body)).toEqual('{"data":{}}')
  })

  it('should work', async () => {
    const http = new Http()
    const handler = new Func({
      plugins: [http],
      async handler() {
        return http.headers
      },
    }).export().handler

    const res = await handler({ headers: { key: 'value' } })

    expect(res.statusCode).toEqual(200)
    expect(res.body).toBeInstanceOf(ReadableStream)
    expect(await streamToString(res.body)).toEqual('{"data":{"key":"value"}}')
  })
})
