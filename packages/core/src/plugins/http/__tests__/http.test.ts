import { Http, HttpError, type Response, Func } from '@faasjs/core'
import { streamToString } from '@faasjs/utils'
import { describe, expect, it } from 'vitest'

describe('http', () => {
  it('should work', async () => {
    const http = new Http({ config: { cookie: { session: { secret: 'test-secret' } } } })
    const handler = new Func({
      plugins: [http],
      async handler() {
        return 1
      },
    }).export().handler

    const res = await handler({
      headers: {},
      body: null,
    })

    expect(res.statusCode).toEqual(200)
    expect(res.body).toBeInstanceOf(ReadableStream)
    expect(await streamToString(res.body as ReadableStream)).toEqual('{"data":1}')
  })

  it('with config name', async () => {
    const http = new Http({
      name: 'name',
      config: { cookie: { session: { secret: 'test-secret' } } },
    })
    const func = new Func({
      plugins: [http],
      async handler() {
        return 1
      },
    })

    func.config = {
      plugins: { name: { type: 'name' } },
    }
    const handler = func.export().handler

    const res = await handler({
      headers: {},
      body: null,
    })

    expect(res.statusCode).toEqual(200)
    expect(res.body).toBeInstanceOf(ReadableStream)
    expect(await streamToString(res.body as ReadableStream)).toEqual('{"data":1}')
  })

  it('throw error', async () => {
    const http = new Http({ config: { cookie: { session: { secret: 'test-secret' } } } })
    const handler = new Func({
      plugins: [http],
      async handler() {
        throw Error('wrong')
      },
    }).export().handler

    const res = await handler({})

    expect(res.statusCode).toEqual(500)
    expect(res.body).toBeInstanceOf(ReadableStream)
    expect(await streamToString(res.body as ReadableStream)).toEqual(
      '{"error":{"message":"wrong"}}',
    )
  })

  it('HttpError', async () => {
    const http = new Http({ config: { cookie: { session: { secret: 'test-secret' } } } })
    const handler = new Func({
      plugins: [http],
      async handler() {
        throw new HttpError({
          statusCode: 400,
          message: 'wrong',
        })
      },
    }).export().handler

    const res = await handler({})

    expect(res.statusCode).toEqual(400)
    expect(res.body).toBeInstanceOf(ReadableStream)
    expect(await streamToString(res.body as ReadableStream)).toEqual(
      '{"error":{"message":"wrong"}}',
    )
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
      const http = new Http({ config: { cookie: { session: { secret: 'test-secret' } } } })
      const handler = new Func({
        plugins: [http],
        async handler() {
          return 1
        },
      }).export().handler

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
