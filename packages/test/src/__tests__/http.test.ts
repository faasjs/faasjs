import { FuncWarper } from '../../src/index'

test('http', async () => {
  const func = new FuncWarper(require.resolve('./funcs/http.func'))

  const res = await func.handler({}, {})

  expect(res.body).toEqual('{"data":true}')
})

test('JSONhandler data', async () => {
  const func = new FuncWarper(require.resolve('./funcs/json.func'))

  const res = await func.JSONhandler<number>({ key: 1 })

  expect(res.body).toEqual('{"data":1}')
  expect(res.data).toEqual(1)
  expect(res.cookie).toMatchObject({ cookie: 'cookie' })
  expect(res.session).toEqual({ session: 'session' })
})

test('JSONhandler error', async () => {
  const func = new FuncWarper(require.resolve('./funcs/http-error.func'))

  const res = await func.JSONhandler()

  expect(res.error.message).toEqual('message')
})
