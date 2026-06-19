import { streamToString } from '@faasjs/utils'
import { describe, expect, it } from 'vitest'

import { createHttpHandler } from './helpers'

describe('setBody', () => {
  it('should work', async () => {
    const handler = createHttpHandler(({ setBody }) => {
      setBody('body')
    })

    const res = await handler({})

    expect(await streamToString(res.body)).toEqual('{"data":"body"}')
  })

  it.each([
    { value: 0, body: '{"data":0}' },
    { value: false, body: '{"data":false}' },
    { value: '', body: '{"data":""}' },
    { value: null, body: '{"data":null}' },
  ])('should preserve falsy body value $value', async (item) => {
    const handler = createHttpHandler(({ setBody }) => {
      setBody(item.value)
    })

    const res = await handler({})

    expect(res.statusCode).toEqual(200)
    expect(await streamToString(res.body)).toEqual(item.body)
  })
})
