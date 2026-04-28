import { ApiTester } from '@faasjs/dev'
import { streamToObject } from '@faasjs/utils'
import { expect, it } from 'vitest'

import inferredPathApi from '../fixtures/src/blog/api/post/default.api'
import errorStreamApi from '../funcs/error-stream.api'
import httpErrorApi from '../funcs/http-error.api'
import httpApi from '../funcs/http.api'
import jsonApi from '../funcs/json.api'
import streamApi from '../funcs/stream.api'

it('http', async () => {
  const api = new ApiTester(httpApi)

  const res = await api.handler({}, {})

  expect(await streamToObject(res.body)).toMatchObject({ data: true })
})

it('JSONhandler data', async () => {
  const api = new ApiTester(jsonApi)

  const res = await api.JSONhandler<number>({ key: 1 })

  expect(res.body).toEqual('{"data":1}')
  expect(res.data).toEqual(1)
  expect(res.cookie).toMatchObject({ cookie: 'cookie' })
  expect(res.session).toEqual({ session: 'session' })
})

it('JSONhandler error', async () => {
  const api = new ApiTester(httpErrorApi)

  const res = await api.JSONhandler()

  if (!res.error) throw new Error('Expected JSONhandler to return error')
  expect(res.error.message).toEqual('message')
})

it('JSONhandler infers path from filename', async () => {
  const api = new ApiTester(inferredPathApi)

  const res = await api.JSONhandler()

  expect(res.data).toEqual({
    path: '/blog/api/post',
  })
})

it('JSONhandler path override', async () => {
  const api = new ApiTester(inferredPathApi)

  const res = await api.JSONhandler(null, {
    path: '/blog/api/post/not-found',
  })

  expect(res.data).toEqual({
    path: '/blog/api/post/not-found',
  })
})

it('JSONhandler with ReadableStream', async () => {
  const api = new ApiTester(streamApi)

  const res = await api.JSONhandler()

  expect(res.body).toEqual('Hello World!')
  expect(res.statusCode).toEqual(200)
})

it('JSONhandler with error ReadableStream', async () => {
  const api = new ApiTester(errorStreamApi)

  const res = await api.JSONhandler()

  if (!res.error) throw new Error('Expected JSONhandler to return error')
  expect(res.error.message).toEqual('Stream error')
})
