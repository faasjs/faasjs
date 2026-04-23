import { testApi } from '@faasjs/dev'
import { describe, expect, it } from 'vitest'

import api from '../me.api'

describe('pages/home/api/auth/me', () => {
  it('returns the current user from the auth plugin demo', async () => {
    const handler = testApi(api)

    const { statusCode, data } = await handler(
      {},
      {
        headers: {
          authorization: 'Bearer demo-admin',
        },
      },
    )

    expect(statusCode).toEqual(200)
    expect(data).toEqual({
      current_user: {
        id: 1,
        name: 'Demo Admin',
        role: 'admin',
      },
    })
  })

  it('rejects requests without the demo token', async () => {
    const handler = testApi(api)

    const { statusCode, error } = await handler()

    expect(statusCode).toEqual(401)
    expect(error).toEqual({
      message: 'Missing demo auth token',
    })
  })
})
