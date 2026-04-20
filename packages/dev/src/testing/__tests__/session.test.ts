import { describe, expect, it } from 'vitest'

import { test } from '../../index'
import sessionApi from './funcs/session.api'

describe('JSONhandler', () => {
  it('session', async () => {
    const api = test(sessionApi)

    const res = await api.JSONhandler(
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
    const api = test(sessionApi)

    const res = await api.JSONhandler(
      {},
      {
        cookie: { c: 2 },
      },
    )

    expect(Array.isArray(res.data)).toBe(true)
    expect((res.data as any[])[1]).toBe('2')
  })
})
