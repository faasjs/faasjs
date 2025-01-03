import { expect, it } from 'vitest'
import { FuncWarper } from '../../src/index'

it('http', async () => {
  const func = new FuncWarper(await import('./funcs/http.func'))

  const res = await func.handler({}, {})

  expect(res.body).toEqual('{"data":true}')
})

it('JSONhandler data', async () => {
  const func = new FuncWarper(await import('./funcs/json.func'))

  const res = await func.JSONhandler<number>({ key: 1 })

  expect(res.body).toEqual('{"data":1}')
  expect(res.data).toEqual(1)
  expect(res.cookie).toMatchObject({ cookie: 'cookie' })
  expect(res.session).toEqual({ session: 'session' })
})

it('JSONhandler error', async () => {
  const func = new FuncWarper(await import('./funcs/http-error.func'))

  const res = await func.JSONhandler()

  expect(res.error.message).toEqual('message')
})
