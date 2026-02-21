import { describe, expect, it } from 'vitest'
import { Func } from '..'
import { Http } from '../index'

describe('stream', () => {
  it('should handle Web ReadableStream', async () => {
    const http = new Http()
    const handler = new Func({
      plugins: [http],
      async handler() {
        return new ReadableStream({
          start(controller) {
            controller.enqueue('hello world')
            controller.close()
          },
        })
      },
    }).export().handler

    const res = await handler({
      headers: { 'accept-encoding': 'gzip' },
      body: null,
    })

    expect(res.body).toBeInstanceOf(ReadableStream)
    expect(res.headers['content-encoding']).toBeUndefined()
  })

  it('should not compress streams', async () => {
    const http = new Http()
    const handler = new Func({
      plugins: [http],
      async handler() {
        return new ReadableStream({
          start(controller) {
            controller.enqueue('x'.repeat(1000))
            controller.close()
          },
        })
      },
    }).export().handler

    const res = await handler({
      headers: { 'accept-encoding': 'gzip' },
      body: null,
    })

    expect(res.headers['content-encoding']).toBeUndefined()
    expect(res.body).toBeInstanceOf(ReadableStream)
  })

  it('should handle small streams', async () => {
    const http = new Http()
    const handler = new Func({
      plugins: [http],
      async handler() {
        return new ReadableStream({
          start(controller) {
            controller.enqueue('hello')
            controller.close()
          },
        })
      },
    }).export().handler

    const res = await handler({
      headers: {},
      body: null,
    })

    expect(res.body).toBeInstanceOf(ReadableStream)
  })

  it('should preserve stream with custom headers', async () => {
    const http = new Http()
    const handler = new Func({
      plugins: [http],
      async handler() {
        return {
          body: new ReadableStream({
            start(controller) {
              controller.enqueue('data')
              controller.close()
            },
          }),
          headers: { 'custom-header': 'value' },
          statusCode: 200,
        }
      },
    }).export().handler

    const res = await handler({
      headers: {},
      body: null,
    })

    expect(res.body).toBeInstanceOf(ReadableStream)
    expect(res.headers['custom-header']).toBe('value')
    expect(res.statusCode).toBe(200)
  })
})
