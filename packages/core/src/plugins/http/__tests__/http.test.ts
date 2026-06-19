import { Func, Http, HttpError, type Response } from '@faasjs/core'
import { streamToString } from '@faasjs/utils'
import { describe, expect, it } from 'vitest'

import { createHttpFunc, createHttpHandler } from './helpers'

describe('http', () => {
  it('should work', async () => {
    const handler = createHttpHandler(() => 1)

    const res = await handler({
      headers: {},
      body: null,
    })

    expect(res.statusCode).toEqual(200)
    expect(await streamToString(res.body)).toEqual('{"data":1}')
  })

  it.each([
    { value: 0, body: '{"data":0}' },
    { value: false, body: '{"data":false}' },
    { value: '', body: '{"data":""}' },
    { value: null, body: '{"data":null}' },
  ])('should preserve falsy handler response $value', async (item) => {
    const handler = createHttpHandler(() => item.value)

    const res = await handler({
      headers: {},
      body: null,
    })

    expect(res.statusCode).toEqual(200)
    expect(await streamToString(res.body)).toEqual(item.body)
  })

  it('with config name', async () => {
    const handler = createHttpFunc(() => 1, {
      config: { plugins: { name: { type: 'name' } } },
      http: { name: 'name' },
    }).export().handler

    const res = await handler({
      headers: {},
      body: null,
    })

    expect(res.statusCode).toEqual(200)
    expect(await streamToString(res.body)).toEqual('{"data":1}')
  })

  it('throw error', async () => {
    const handler = createHttpHandler(() => {
      throw Error('wrong')
    })

    const res = await handler({})

    expect(res.statusCode).toEqual(500)
    expect(await streamToString(res.body)).toEqual('{"error":{"message":"wrong"}}')
  })

  it('HttpError', async () => {
    const handler = createHttpHandler(() => {
      throw new HttpError({
        statusCode: 400,
        message: 'wrong',
      })
    })

    const res = await handler({})

    expect(res.statusCode).toEqual(400)
    expect(await streamToString(res.body)).toEqual('{"error":{"message":"wrong"}}')
  })

  it('typed Http plugin', async () => {
    const func = new Func({
      plugins: [
        new Http<{ key: string }>({ config: { cookie: { session: { secret: 'test-secret' } } } }),
      ],
      async handler({ params }) {
        return params
      },
    })

    const res = await func.export().handler({
      queryString: {
        key: 'value',
      },
    })

    expect(res).toMatchObject({
      key: 'value',
      statusCode: 200,
    })
  })

  it('should isolate params between concurrent requests', async () => {
    let pending = 0
    let release: (() => void) | undefined
    const ready = new Promise<void>((resolve) => {
      release = resolve
    })

    const func = new Func({
      plugins: [
        new Http<{ id: string }>({ config: { cookie: { session: { secret: 'test-secret' } } } }),
      ],
      async handler({ params }) {
        const first = params.id

        pending += 1
        if (pending === 2) release?.()

        await ready

        return {
          first,
          seen: params.id,
        }
      },
    })

    const handler = func.export().handler as (event?: {
      queryString?: { id: string }
    }) => Promise<Response>

    const [resA, resB] = await Promise.all([
      handler({
        queryString: { id: 'A' },
      }),
      handler({
        queryString: { id: 'B' },
      }),
    ])

    expect(await streamToString(resA.body as ReadableStream)).toEqual(
      '{"data":{"first":"A","seen":"A"}}',
    )
    expect(await streamToString(resB.body as ReadableStream)).toEqual(
      '{"data":{"first":"B","seen":"B"}}',
    )
  })

  it('should emit stream error when TextEncoder fails', async () => {
    const TextEncoderBackup = globalThis.TextEncoder
    ;(globalThis as any).TextEncoder = class {
      encode() {
        throw Error('encode failed')
      }
    }

    try {
      const handler = createHttpHandler(() => 1)

      const res = await handler({
        headers: {},
        body: null,
      })

      await expect(streamToString(res.body as ReadableStream)).rejects.toThrow('encode failed')
    } finally {
      globalThis.TextEncoder = TextEncoderBackup
    }
  })
})
