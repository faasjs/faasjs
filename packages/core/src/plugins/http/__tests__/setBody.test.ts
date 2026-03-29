import { streamToText } from '@faasjs/dev'
import { describe, expect, it } from 'vitest'

import { Http } from '..'
import { Func } from '../../..'

describe('setBody', () => {
  it('should work', async () => {
    const http = new Http()
    const handler = new Func({
      plugins: [http],
      async handler({ setBody }) {
        setBody('body')
      },
    }).export().handler

    const res = await handler({})

    expect(res.body).toBeInstanceOf(ReadableStream)
    expect(await streamToText(res.body)).toEqual('{"data":"body"}')
  })
})
