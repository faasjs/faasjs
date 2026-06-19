import { ContentType } from '@faasjs/core'
import { describe, expect, it } from 'vitest'

import { createHttpHandler } from './helpers'

describe('setContentType', () => {
  it.each(Object.keys(ContentType))('type is %s', async (type) => {
    const handler = createHttpHandler(({ setContentType }) => {
      setContentType(type)
    })

    const res = await handler({})

    expect(res.statusCode).toEqual(204)
    expect(res.headers['content-type']).toEqual(`${ContentType[type]}; charset=utf-8`)
  })

  it('set charset', async () => {
    const handler = createHttpHandler(({ setContentType }) => {
      setContentType('type', 'utf-16')
    })

    const res = await handler({})

    expect(res.statusCode).toEqual(204)
    expect(res.headers['content-type']).toEqual('type; charset=utf-16')
  })
})
