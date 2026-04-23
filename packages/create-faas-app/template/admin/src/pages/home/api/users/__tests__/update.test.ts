import { testApi } from '@faasjs/dev'
import { getClient } from '@faasjs/pg'
import { describe, expect, it } from 'vitest'

import api from '../update.api'

describe('pages/home/api/users/update', () => {
  it('updates one user', async () => {
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
    const { statusCode, data } = await handler({
      id: created.id,
      name: 'Ada Lovelace',
    })

    expect(statusCode).toEqual(200)
    expect(data).toEqual({
      message: `Updated user #${created.id}`,
      user: {
        id: created.id,
        name: 'Ada Lovelace',
      },
    })

    await expect(client.query('users').where('id', created.id).first()).resolves.toEqual({
      id: created.id,
      name: 'Ada Lovelace',
    })
  })

  it('returns 404 when the user is missing', async () => {
    const handler = testApi(api)
    const { statusCode, error } = await handler({
      id: 404,
      name: 'Missing',
    })

    expect(statusCode).toEqual(404)
    expect(error).toEqual({
      message: 'User not found',
    })
  })
})
