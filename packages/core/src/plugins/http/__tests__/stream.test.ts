import { describe, expect, it } from 'vitest'

import { createHttpHandler, createStream } from './helpers'

describe('stream', () => {
  it.each([
    ['Web ReadableStream', 'hello world'],
    ['stream response', 'x'.repeat(1000)],
    ['small streams', 'hello'],
  ])('should handle %s', async (_, chunk) => {
    const handler = createHttpHandler(() => createStream(chunk))

    const res = await handler({
      headers: {},
      body: null,
    })

    expect(res.body).toBeInstanceOf(ReadableStream)
  })

  it('should preserve stream with custom headers', async () => {
    const handler = createHttpHandler(() => ({
      body: createStream('data'),
      headers: { 'custom-header': 'value' },
      statusCode: 200,
    }))

    const res = await handler({
      headers: {},
      body: null,
    })

    expect(res.body).toBeInstanceOf(ReadableStream)
    expect(res.headers['custom-header']).toBe('value')
    expect(res.statusCode).toBe(200)
  })
})
