import { Func } from '@faasjs/func'
import { describe, expect, it } from 'vitest'
import { ContentType, Http } from '..'

describe('setContentType', () => {
  it.each(Object.keys(ContentType))('type is %s', async type => {
    const http = new Http()
    const handler = new Func({
      plugins: [http],
      async handler() {
        http.setContentType(type)
      },
    }).export().handler

    const res = await handler({})

    expect(res.statusCode).toEqual(201)
    expect(res.headers['content-type']).toEqual(
      `${ContentType[type]}; charset=utf-8`
    )
  })

  it('set charset', async () => {
    const http = new Http()
    const handler = new Func({
      plugins: [http],
      async handler() {
        http.setContentType('type', 'utf-16')
      },
    }).export().handler

    const res = await handler({})

    expect(res.statusCode).toEqual(201)
    expect(res.headers['content-type']).toEqual('type; charset=utf-16')
  })
})
