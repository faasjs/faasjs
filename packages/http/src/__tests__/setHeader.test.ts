import { Func } from '@faasjs/func'
import { describe, expect, it } from 'vitest'
import { Http } from '..'

describe('setHeader', () => {
  it('should work', async () => {
    const http = new Http()
    const handler = new Func({
      plugins: [http],
      async handler() {
        http.setHeader('key', 'value')
      },
    }).export().handler

    const res = await handler({})

    expect(res.statusCode).toEqual(204)
    expect(res.headers.key).toEqual('value')
  })
})
