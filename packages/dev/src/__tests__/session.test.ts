import { describe, expect, it } from 'vitest'
import { FuncWarper } from '../../src/index'
import { func as Func } from './funcs/session.func'

describe('JSONhandler', () => {
  it('session', async () => {
    const func = new FuncWarper(Func)

    const res = await func.JSONhandler(
      {},
      {
        headers: { cookie: 'h=1' },
        cookie: { c: 2 },
        session: { s: 3 },
      },
    )

    expect(res.body).toEqual('{"data":["1","2",3]}')
    expect(res.data).toEqual(['1', '2', 3])
  })

  it('should merge cookies when header cookie is not provided', async () => {
    const func = new FuncWarper(Func)

    const res = await func.JSONhandler(
      {},
      {
        cookie: { c: 2 },
      },
    )

    expect(Array.isArray(res.data)).toBe(true)
    expect((res.data as any[])[1]).toBe('2')
  })
})
