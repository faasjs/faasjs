import { Http, Func } from '@faasjs/core'
import { describe, expect, it } from 'vitest'

describe('setStatusCode', () => {
  it('should work', async () => {
    const http = new Http({ config: { cookie: { session: { secret: 'test-secret' } } } })
    const handler = new Func({
      plugins: [http],
      async handler({ setStatusCode }) {
        setStatusCode(404)
      },
    }).export().handler

    const res = await handler({})

    expect(res.statusCode).toEqual(404)
  })
})
