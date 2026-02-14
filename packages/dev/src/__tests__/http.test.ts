import { expect, it } from 'vitest'
import { FuncWarper, streamToObject } from '../../src/index'
import { func as ErrorStreamFunc } from './funcs/error-stream.func'
import { func as Http } from './funcs/http.func'
import { func as HttpError } from './funcs/http-error.func'
import { func as Json } from './funcs/json.func'
import { func as StreamFunc } from './funcs/stream.func'

it('http', async () => {
  const func = new FuncWarper(Http)

  const res = await func.handler({}, {})

  expect(await streamToObject(res.body)).toMatchObject({ data: true })
})

it('JSONhandler data', async () => {
  const func = new FuncWarper(Json)

  const res = await func.JSONhandler<number>({ key: 1 })

  expect(res.body).toEqual('{"data":1}')
  expect(res.data).toEqual(1)
  expect(res.cookie).toMatchObject({ cookie: 'cookie' })
  expect(res.session).toEqual({ session: 'session' })
})

it('JSONhandler error', async () => {
  const func = new FuncWarper(HttpError)

  const res = await func.JSONhandler()

  expect(res.error.message).toEqual('message')
})

it('JSONhandler with ReadableStream', async () => {
  const func = new FuncWarper(StreamFunc)

  const res = await func.JSONhandler()

  expect(res.body).toEqual('Hello World!')
  expect(res.statusCode).toEqual(200)
})

it('JSONhandler with error ReadableStream', async () => {
  const func = new FuncWarper(ErrorStreamFunc)

  const res = await func.JSONhandler()

  expect(res.error.message).toEqual('Stream error')
})
