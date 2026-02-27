import { streamToString } from '@faasjs/dev'
import { describe, expect, it } from 'vitest'
import { Func } from '../../..'
import { Http } from '..'

describe('setBody', () => {
  it('should work', async () => {
    const http = new Http()
    const handler = new Func({
      plugins: [http],
      async handler() {
        http.setBody('body')
      },
    }).export().handler

    const res = await handler({})

    expect(res.body).toBeInstanceOf(ReadableStream)
    expect(await streamToString(res.body)).toEqual('{"data":"body"}')
  })
})
