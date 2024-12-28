import { FuncWarper } from '../../src/index'

it('http', async () => {
  const func = new FuncWarper(require.resolve('./funcs/http.func.ts'))

  const res = await func.handler({}, {})

  expect(res.body).toEqual('{"data":true}')
})

it('JSONhandler data', async () => {
  const func = new FuncWarper(require.resolve('./funcs/json.func.ts'))

  const res = await func.JSONhandler<number>({ key: 1 })

  expect(res.body).toEqual('{"data":1}')
  expect(res.data).toEqual(1)
  expect(res.cookie).toMatchObject({ cookie: 'cookie' })
  expect(res.session).toEqual({ session: 'session' })
})

it('JSONhandler error', async () => {
  const func = new FuncWarper(require.resolve('./funcs/http-error.func.ts'))

  const res = await func.JSONhandler()

  expect(res.error.message).toEqual('message')
})
