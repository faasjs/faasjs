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
})
