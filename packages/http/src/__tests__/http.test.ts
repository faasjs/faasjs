import { Func } from '@faasjs/func'
import { Http, HttpError } from '..'

describe('http', () => {
  test('should work', async () => {
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
    expect(res.body).toEqual('{"data":1}')
  })

  test('with config name', async () => {
    const http = new Http({ name: 'name' })
    const func = new Func({
      plugins: [http],
      async handler() {
        return 1
      },
    })

    func.config = {
      providers: {},
      plugins: { name: { type: 'name' } },
    }
    const handler = func.export().handler

    const res = await handler({
      headers: {},
      body: null,
    })

    expect(res.statusCode).toEqual(200)
    expect(res.body).toEqual('{"data":1}')
  })

  test('throw error', async () => {
    const http = new Http()
    const handler = new Func({
      plugins: [http],
      async handler() {
        throw Error('wrong')
      },
    }).export().handler

    const res = await handler({})

    expect(res.statusCode).toEqual(500)
    expect(res.body).toEqual('{"error":{"message":"wrong"}}')
  })

  test('HttpError', async () => {
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
    expect(res.body).toEqual('{"error":{"message":"wrong"}}')
  })
})
