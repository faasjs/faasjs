import { beforeEach, describe, expect, it, vi } from 'vitest'
import { FaasBrowserClient, Response as FaasResponse, setMock } from '..'

describe('stream', () => {
  beforeEach(() => {
    window.fetch = vi.fn()
  })

  it('returns native Response when stream is true', async () => {
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(new TextEncoder().encode('chunk'))
        controller.close()
      },
    })

    window.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        body: stream,
        headers: new Headers({ 'Content-Type': 'text/plain' }),
      } as Response)
    ) as any

    const client = new FaasBrowserClient('/')
    const response = await client.action(
      'test',
      { key: 'value' },
      { stream: true }
    )

    expect(response).not.toBeInstanceOf(FaasResponse)
    expect(response.body).toBeInstanceOf(ReadableStream)

    const reader = response.body.getReader()
    const { value } = await reader.read()
    expect(new TextDecoder().decode(value)).toBe('chunk')
  })

  it('maintains original behavior when stream is false or undefined', async () => {
    window.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        headers: new Headers({ 'Content-Type': 'application/json' }),
        text: () => Promise.resolve('{"data":{"value":"test"}}'),
      } as Response)
    ) as any

    const client = new FaasBrowserClient('/')

    const response1 = await client.action('test', { key: 'value' })
    expect(response1).toBeInstanceOf(FaasResponse)
    expect(response1.data).toEqual({ value: 'test' })

    const response2 = await client.action(
      'test',
      { key: 'value' },
      { stream: false }
    )
    expect(response2).toBeInstanceOf(FaasResponse)
    expect(response2.data).toEqual({ value: 'test' })
  })

  it('supports reading stream data', async () => {
    const chunks = ['chunk1', 'chunk2', 'chunk3']

    const stream = new ReadableStream({
      start(controller) {
        chunks.forEach(chunk => {
          controller.enqueue(new TextEncoder().encode(chunk))
        })
        controller.close()
      },
    })

    window.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        body: stream,
        headers: new Headers({ 'Content-Type': 'text/plain' }),
      } as Response)
    ) as any

    const client = new FaasBrowserClient('/')
    const response = await client.action(
      'test',
      { key: 'value' },
      { stream: true }
    )

    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    const receivedChunks = []

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      const chunk = decoder.decode(value)
      receivedChunks.push(chunk)
    }

    expect(receivedChunks).toEqual(chunks)
  })

  it('supports abort controller', async () => {
    window.fetch = vi.fn((url: string, options: any) => {
      return Promise.resolve({
        ok: true,
        status: 200,
        body: new ReadableStream({
          start(controller) {
            options.signal.addEventListener('abort', () => {
              controller.close()
            })
          },
        }),
        headers: new Headers({ 'Content-Type': 'text/plain' }),
      } as Response)
    }) as any

    const controller = new AbortController()
    const client = new FaasBrowserClient('/')
    const response = await client.action(
      'test',
      { key: 'value' },
      {
        stream: true,
        signal: controller.signal,
      }
    )

    const reader = response.body.getReader()
    controller.abort()

    const { done } = await reader.read()
    expect(done).toBe(true)
  })

  it('preserves headers in stream mode', async () => {
    const stream = new ReadableStream({
      start(controller) {
        controller.close()
      },
    })

    window.fetch = vi.fn((url: string, options: any) => {
      expect(options.headers['Content-Type']).toBe(
        'application/json; charset=UTF-8'
      )
      expect(options.headers['X-FaasJS-Request-Id']).toBeDefined()

      return Promise.resolve({
        ok: true,
        status: 200,
        body: stream,
        headers: new Headers(),
      } as Response)
    }) as any

    const client = new FaasBrowserClient('/')
    await client.action('test', { key: 'value' }, { stream: true })
  })

  it('supports custom request in stream mode', async () => {
    const stream = new ReadableStream({
      start(controller) {
        controller.close()
      },
    })

    const customRequest = vi.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        body: stream,
        headers: new Headers(),
      } as Response)
    )

    const client = new FaasBrowserClient('/', {
      request: customRequest as any,
    })

    const response = await client.action(
      'test',
      { key: 'value' },
      { stream: true }
    )

    expect(customRequest).toHaveBeenCalled()
    expect(response.body).toBeInstanceOf(ReadableStream)
  })

  it('supports mock in stream mode', async () => {
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(new TextEncoder().encode('mocked'))
        controller.close()
      },
    })

    setMock(
      async () =>
        new Promise(resolve => {
          resolve({
            ok: true,
            status: 200,
            body: stream,
            headers: new Headers(),
          } as Response)
        }) as any
    )

    const client = new FaasBrowserClient('/')
    const response = await client.action(
      'test',
      { key: 'value' },
      { stream: true }
    )

    expect(response.body).toBeInstanceOf(ReadableStream)

    setMock(null)
  })

  it('handles errors in stream mode', async () => {
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(new TextEncoder().encode('error'))
        controller.close()
      },
    })

    window.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
        status: 500,
        body: stream,
        headers: new Headers({ 'Content-Type': 'text/plain' }),
      } as Response)
    ) as any

    const client = new FaasBrowserClient('/')
    const response = await client.action(
      'test',
      { key: 'value' },
      { stream: true }
    )

    expect(response.status).toBe(500)
    expect(response.body).toBeInstanceOf(ReadableStream)
  })
})
