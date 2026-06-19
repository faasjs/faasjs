import { streamToString } from '@faasjs/utils'
import { describe, expect, it } from 'vitest'

import { createHttpHandler } from './helpers'

describe('headers', () => {
  const handler = createHttpHandler((data) => data.headers)

  it.each([
    ['blank', {}, '{"data":{}}'],
    ['should work', { headers: { key: 'value' } }, '{"data":{"key":"value"}}'],
  ])('%s', async (_, event, body) => {
    const res = await handler(event)

    expect(res.statusCode).toEqual(200)
    expect(await streamToString(res.body)).toEqual(body)
  })
})
