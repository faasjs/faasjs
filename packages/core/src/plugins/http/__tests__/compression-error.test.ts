import { Http, Func } from '@faasjs/core'
import { streamToString } from '@faasjs/utils'
import { describe, expect, it, vi } from 'vitest'

vi.mock('node:zlib', () => {
  class BrokenCompressor {
    private listeners: Record<string, ((error: Error) => void)[]> = Object.create(null)

    on(event: string, listener: (error: Error) => void) {
      ;(this.listeners[event] || (this.listeners[event] = [])).push(listener)
      return this
    }

    private emit(event: string, value: Error) {
      for (const listener of this.listeners[event] || []) listener(value)
    }

    write() {
      queueMicrotask(() => {
        this.emit('error', Error('gzip broke'))
      })
    }

    end() {}
  }

  return {
    createBrotliCompress: () => new BrokenCompressor(),
    createDeflate: () => new BrokenCompressor(),
    createGzip: () => new BrokenCompressor(),
  }
})

describe('http/compression error', () => {
  it('should surface compression stream failures', async () => {
    const handler = new Func({
      plugins: [new Http({ config: { cookie: { session: { secret: 'test-secret' } } } })],
      async handler() {
        return 'x'.repeat(2048)
      },
    }).export().handler

    const res = await handler({
      headers: {
        'accept-encoding': 'gzip',
      },
      body: null,
    })

    expect(res.headers['Content-Encoding']).toBe('gzip')
    expect(res.body).toBeInstanceOf(ReadableStream)
    await expect(streamToString(res.body as ReadableStream)).rejects.toThrow('gzip broke')
  })
})
