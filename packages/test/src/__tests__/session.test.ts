import { FuncWarper } from '../../src/index'

describe('JSONhandler', () => {
  test('session', async () => {
    const func = new FuncWarper(require.resolve('./funcs/session.func'))

    const res = await func.JSONhandler(
      {},
      {
        headers: { cookie: 'h=1' },
        cookie: { c: 2 },
        session: { s: 3 },
      }
    )

    expect(res.body).toEqual('{"data":["1","2",3]}')
    expect(res.data).toEqual(['1', '2', 3])
  })
})
