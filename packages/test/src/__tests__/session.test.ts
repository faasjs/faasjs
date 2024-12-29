import { describe, expect, it } from 'vitest'
import { FuncWarper } from '../../src/index'
import Func from './funcs/session.func'

describe('JSONhandler', () => {
  it('session', async () => {
    const func = new FuncWarper(Func)

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
