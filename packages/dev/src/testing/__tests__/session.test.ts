import { testApi } from '@faasjs/dev'
import { describe, expect, it } from 'vitest'

import jsonApi from '../apis/json.api'
import sessionApi from '../apis/session.api'

describe('JSONhandler', () => {
  it('testApi should keep JSONhandler argument order', async () => {
    const handler = testApi(jsonApi)

    const res = await handler(
      { key: 1 },
      {
        headers: { cookie: 'h=1' },
        cookie: { c: 2 },
        session: { s: 3 },
      },
    )

    expect(res.body).toEqual('{"data":1}')
    expect(res.data).toEqual(1)
    expect(res.cookie).toMatchObject({ cookie: 'cookie', h: '1', c: 2 })
    expect(res.session).toMatchObject({ s: 3, session: 'session' })
  })

  it('session', async () => {
    const api = testApi(sessionApi)

    const res = await api(
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
    const api = testApi(sessionApi)

    const res = await api(
      {},
      {
        cookie: { c: 2 },
      },
    )

    expect(Array.isArray(res.data)).toBe(true)
    expect((res.data as any[])[1]).toBe('2')
  })
})
