import { Http, Func } from '@faasjs/core'
import { describe, expect, it } from 'vitest'

describe('setHeader', () => {
  it('should work', async () => {
    const http = new Http({ config: { cookie: { session: { secret: 'test-secret' } } } })
    const handler = new Func({
      plugins: [http],
      async handler({ setHeader }) {
        setHeader('key', 'value')
      },
    }).export().handler

    const res = await handler({})

    expect(res.statusCode).toEqual(204)
    expect(res.headers.key).toEqual('value')
  })
})
