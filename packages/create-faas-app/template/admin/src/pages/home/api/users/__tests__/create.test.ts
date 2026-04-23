import { testApi } from '@faasjs/dev'
import { getClient } from '@faasjs/pg'
import { describe, expect, it } from 'vitest'

import api from '../create.api'

describe('pages/home/api/users/create', () => {
  it('creates a user with the shared pg bootstrap', async () => {
    const handler = testApi(api)

    const { statusCode, data } = await handler({ name: 'world' })

    expect(statusCode).toEqual(200)
    expect(data).toEqual({
      message: 'Created user #1',
      total: 1,
      user: {
        id: 1,
        name: 'world',
      },
    })

    const client = await getClient()

    await expect(client.query('users').orderBy('id', 'ASC')).resolves.toEqual([
      {
        id: 1,
        name: 'world',
      },
    ])
  })

  it('uses the default name when params.name is missing', async () => {
    const handler = testApi(api)

    const { data } = await handler({})

    expect(data).toEqual({
      message: 'Created user #1',
      total: 1,
      user: {
        id: 1,
        name: 'FaasJS',
      },
    })
  })
})
