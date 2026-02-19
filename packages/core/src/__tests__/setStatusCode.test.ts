import { Func } from '@faasjs/func'
import { describe, expect, it } from 'vitest'
import { Http } from '../index'

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
