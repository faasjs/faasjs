import { defineApi } from '@faasjs/core'
import { getClient } from '@faasjs/pg'
import * as z from 'zod'

export default defineApi({
  schema: z.object({
    name: z.string().min(1).optional(),
  }),
  async handler({ params }) {
    const client = await getClient()
    const [user] = await client.query('users').insert(
      {
        name: params.name || 'FaasJS',
      },
      {
        returning: ['id', 'name'],
      },
    )

    return {
      message: `Created user #${user.id}`,
      total: await client.query('users').count(),
      user,
    }
  },
})
