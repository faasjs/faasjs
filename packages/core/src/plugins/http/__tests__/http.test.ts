import { streamToString } from '@faasjs/dev'
import { describe, expect, it } from 'vitest'
import { Func, useFunc } from '../../..'
import { Http, HttpError, useHttp } from '..'

describe('http', () => {
  it('should work', async () => {
    const http = new Http()
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
    const http = new Http({ name: 'name' })
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
    const http = new Http()
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
    const http = new Http()
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

  it('useHttp helper', async () => {
    const func = useFunc(() => {
      const http = useHttp<{ key: string }>()

      return async () => http.params
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

  it('should emit stream error when TextEncoder fails', async () => {
    const TextEncoderBackup = globalThis.TextEncoder

    ;(globalThis as any).TextEncoder = class {
      encode() {
        throw Error('encode failed')
      }
    }

    try {
      const http = new Http()
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
