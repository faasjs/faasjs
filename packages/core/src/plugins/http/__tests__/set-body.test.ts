import { Http, Func } from '@faasjs/core'
import { streamToString } from '@faasjs/utils'
import { describe, expect, it } from 'vitest'

describe('setBody', () => {
  it('should work', async () => {
    const http = new Http({ config: { cookie: { session: { secret: 'test-secret' } } } })
    const handler = new Func({
      plugins: [http],
      async handler({ setBody }) {
        setBody('body')
      },
    }).export().handler

    const res = await handler({})

    expect(res.body).toBeInstanceOf(ReadableStream)
    expect(await streamToString(res.body)).toEqual('{"data":"body"}')
  })

  it('should preserve falsy body values', async () => {
    const cases = [
      { value: 0, body: '{"data":0}' },
      { value: false, body: '{"data":false}' },
      { value: '', body: '{"data":""}' },
      { value: null, body: '{"data":null}' },
    ]

    for (const item of cases) {
      const http = new Http({ config: { cookie: { session: { secret: 'test-secret' } } } })
      const handler = new Func({
        plugins: [http],
        async handler({ setBody }) {
          setBody(item.value)
        },
      }).export().handler

      const res = await handler({})

      expect(res.statusCode).toEqual(200)
      expect(res.body).toBeInstanceOf(ReadableStream)
      expect(await streamToString(res.body)).toEqual(item.body)
    }
  })
})
