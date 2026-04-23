import { testApi } from '@faasjs/dev'
import { getClient } from '@faasjs/pg'
import { describe, expect, it } from 'vitest'

import api from '../detail.api'

describe('pages/home/api/users/detail', () => {
  it('returns one user', async () => {
    const client = await getClient()
    const [created] = await client.query('users').insert(
      {
        name: 'Ada',
      },
      {
        returning: ['id'],
      },
    )
    const handler = testApi(api)
    const { statusCode, data } = await handler({ id: created.id })

    expect(statusCode).toEqual(200)
    expect(data).toEqual({
      user: {
        id: created.id,
        name: 'Ada',
      },
    })
  })

  it('returns 404 when the user is missing', async () => {
    const handler = testApi(api)
    const { statusCode, error } = await handler({ id: 404 })

    expect(statusCode).toEqual(404)
    expect(error).toEqual({
      message: 'User not found',
    })
  })
})
