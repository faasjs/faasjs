import { ContentType, Http, Func } from '@faasjs/core'
import { describe, expect, it } from 'vitest'

describe('setContentType', () => {
  it.each(Object.keys(ContentType))('type is %s', async (type) => {
    const http = new Http({ config: { cookie: { session: { secret: 'test-secret' } } } })
    const handler = new Func({
      plugins: [http],
      async handler({ setContentType }) {
        setContentType(type)
      },
    }).export().handler

    const res = await handler({})

    expect(res.statusCode).toEqual(204)
    expect(res.headers['content-type']).toEqual(`${ContentType[type]}; charset=utf-8`)
  })

  it('set charset', async () => {
    const http = new Http({ config: { cookie: { session: { secret: 'test-secret' } } } })
    const handler = new Func({
      plugins: [http],
      async handler({ setContentType }) {
        setContentType('type', 'utf-16')
      },
    }).export().handler

    const res = await handler({})

    expect(res.statusCode).toEqual(204)
    expect(res.headers['content-type']).toEqual('type; charset=utf-16')
  })
})
