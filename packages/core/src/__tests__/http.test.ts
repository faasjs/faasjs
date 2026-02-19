import { streamToString } from '@faasjs/dev'
import { Func } from '@faasjs/func'
import { describe, expect, it } from 'vitest'
import { Http, HttpError } from '../index'

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
})
