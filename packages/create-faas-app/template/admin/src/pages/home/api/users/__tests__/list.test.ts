import { testApi } from '@faasjs/dev'
import { getClient } from '@faasjs/pg'
import { describe, expect, it } from 'vitest'

import api from '../list.api'

describe('pages/home/api/users/list', () => {
  it('lists users with total count', async () => {
    const client = await getClient()

    await client.query('users').insert([{ name: 'Ada' }, { name: 'Grace' }])

    const handler = testApi(api)
    const { statusCode, data } = await handler({ limit: 10 })

    expect(statusCode).toEqual(200)
    expect(data).toEqual({
      total: 2,
      users: [
        {
          id: 2,
          name: 'Grace',
        },
        {
          id: 1,
          name: 'Ada',
        },
      ],
    })
  })
})
