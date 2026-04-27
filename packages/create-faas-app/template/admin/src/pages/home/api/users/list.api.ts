import { defineApi } from '@faasjs/core'
import { getClient } from '@faasjs/pg'
import * as z from 'zod'

export default defineApi({
  schema: z.object({
    limit: z.number().int().positive().max(50).default(20),
  }),
  async handler({ params }) {
    const client = await getClient()
    const users = await client
      .query('users')
      .select('id', 'name')
      .orderBy('id', 'DESC')
      .limit(params.limit)

    return {
      total: await client.query('users').count(),
      users,
    }
  },
})
