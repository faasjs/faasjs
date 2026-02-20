import { brotliCompressSync, deflateSync, gzipSync } from 'node:zlib'
import { Func } from '@faasjs/core'
import { describe, expect, it } from 'vitest'
import { FuncWarper } from '../../src/index'

describe('encoding', () => {
  const data = `hello world ${'x'.repeat(2000)}`

  function compressBody(
    body: string,
    encoding: 'br' | 'gzip' | 'deflate',
  ): ReadableStream<Uint8Array> {
    const buffer = Buffer.from(body)

    const compressed =
      encoding === 'br'
        ? brotliCompressSync(buffer)
        : encoding === 'gzip'
          ? gzipSync(buffer)
          : deflateSync(buffer)

    return new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(new Uint8Array(compressed))
        controller.close()
      },
    })
  }

  it('should decompress br compressed stream', async () => {
    const func = new FuncWarper(
      new Func({
        plugins: [],
        async handler() {
          return {
            statusCode: 200,
            headers: {
              'content-type': 'application/json',
              'content-encoding': 'br',
            },
            body: compressBody(JSON.stringify({ data }), 'br'),
          }
        },
      }),
    )

    const res = await func.JSONhandler()
    expect(res.headers).toMatchObject({
      'content-type': 'application/json',
      'content-encoding': 'br',
    })
    expect(res.body).toEqual(JSON.stringify({ data }))
    expect(res.data).toEqual(data)
  })

  it('should decompress gzip compressed stream', async () => {
    const func = new FuncWarper(
      new Func({
        plugins: [],
        async handler() {
          return {
            statusCode: 200,
            headers: {
              'content-type': 'application/json',
              'content-encoding': 'gzip',
            },
            body: compressBody(JSON.stringify({ data }), 'gzip'),
          }
        },
      }),
    )

    const res = await func.JSONhandler()
    expect(res.headers).toMatchObject({
      'content-type': 'application/json',
      'content-encoding': 'gzip',
    })
    expect(res.body).toEqual(JSON.stringify({ data }))
    expect(res.data).toEqual(data)
  })

  it('should decompress deflate compressed stream', async () => {
    const func = new FuncWarper(
      new Func({
        plugins: [],
        async handler() {
          return {
            statusCode: 200,
            headers: {
              'content-type': 'application/json',
              'content-encoding': 'deflate',
            },
            body: compressBody(JSON.stringify({ data }), 'deflate'),
          }
        },
      }),
    )

    const res = await func.JSONhandler()
    expect(res.headers).toMatchObject({
      'content-type': 'application/json',
      'content-encoding': 'deflate',
    })
    expect(res.body).toEqual(JSON.stringify({ data }))
    expect(res.data).toEqual(data)
  })

  it('should handle uncompressed stream', async () => {
    const func = new FuncWarper(
      new Func({
        plugins: [],
        async handler() {
          return {
            statusCode: 200,
            headers: {
              'content-type': 'application/json',
            },
            body: new ReadableStream<Uint8Array>({
              start(controller) {
                controller.enqueue(new TextEncoder().encode('{"data":"hello"}'))
                controller.close()
              },
            }),
          }
        },
      }),
    )

    const res = await func.JSONhandler()
    expect(res.headers['content-encoding']).toBeUndefined()
    expect(res.data).toEqual('hello')
  })

  it('should handle decompression error with corrupted br data', async () => {
    const func = new FuncWarper(
      new Func({
        plugins: [],
        async handler() {
          return {
            statusCode: 200,
            headers: {
              'content-type': 'application/json',
              'content-encoding': 'br',
            },
            body: new ReadableStream<Uint8Array>({
              start(controller) {
                controller.enqueue(new Uint8Array([0x00, 0x01, 0x02]))
                controller.close()
              },
            }),
          }
        },
      }),
    )

    const res = await func.JSONhandler()
    expect(res.statusCode).toEqual(500)
    expect(res.error).toBeDefined()
    expect(typeof res.error?.message).toBe('string')
  })

  it('should handle decompression error with corrupted gzip data', async () => {
    const func = new FuncWarper(
      new Func({
        plugins: [],
        async handler() {
          return {
            statusCode: 200,
            headers: {
              'content-type': 'application/json',
              'content-encoding': 'gzip',
            },
            body: new ReadableStream<Uint8Array>({
              start(controller) {
                controller.enqueue(new Uint8Array([0x00, 0x01, 0x02]))
                controller.close()
              },
            }),
          }
        },
      }),
    )

    const res = await func.JSONhandler()
    expect(res.statusCode).toEqual(500)
    expect(res.error).toBeDefined()
    expect(typeof res.error?.message).toBe('string')
  })

  it('should handle decompression error with corrupted deflate data', async () => {
    const func = new FuncWarper(
      new Func({
        plugins: [],
        async handler() {
          return {
            statusCode: 200,
            headers: {
              'content-type': 'application/json',
              'content-encoding': 'deflate',
            },
            body: new ReadableStream<Uint8Array>({
              start(controller) {
                controller.enqueue(new Uint8Array([0x00, 0x01, 0x02]))
                controller.close()
              },
            }),
          }
        },
      }),
    )

    const res = await func.JSONhandler()
    expect(res.statusCode).toEqual(500)
    expect(res.error).toBeDefined()
    expect(typeof res.error?.message).toBe('string')
  })

  it('should handle unsupported encoding', async () => {
    const func = new FuncWarper(
      new Func({
        plugins: [],
        async handler() {
          return {
            statusCode: 200,
            headers: {
              'content-type': 'application/json',
              'content-encoding': 'zstd',
            },
            body: new ReadableStream<Uint8Array>({
              start(controller) {
                controller.enqueue(new Uint8Array([0x01]))
                controller.close()
              },
            }),
          }
        },
      }),
    )

    const res = await func.JSONhandler()
    expect(res.statusCode).toEqual(500)
    expect(res.error).toBeDefined()
    expect(res.error?.message).toContain('Unsupported encoding')
  })

  it('should handle stream read error', async () => {
    const func = new FuncWarper(
      new Func({
        plugins: [],
        async handler() {
          return {
            statusCode: 200,
            headers: {
              'content-type': 'application/json',
              'content-encoding': 'br',
            },
            body: new ReadableStream<Uint8Array>({
              start(controller) {
                controller.enqueue(new Uint8Array([0x01]))
                controller.error(new Error('Stream read error'))
              },
            }),
          }
        },
      }),
    )

    const res = await func.JSONhandler()
    expect(res.statusCode).toEqual(500)
    expect(res.error).toBeDefined()
    expect(res.error?.message).toBe('Stream read error')
  })
})
