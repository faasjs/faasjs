import { describe, expect, it } from 'vitest'
import { Func } from '../../..'
import { Http } from '..'

describe('setStatusCode', () => {
  it('should work', async () => {
    const http = new Http()
    const handler = new Func({
      plugins: [http],
      async handler() {
        http.setStatusCode(404)
      },
    }).export().handler

    const res = await handler({})

    expect(res.statusCode).toEqual(404)
  })
})
