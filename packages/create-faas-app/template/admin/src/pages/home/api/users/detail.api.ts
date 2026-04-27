import { defineApi, HttpError } from '@faasjs/core'
import { getClient } from '@faasjs/pg'
import * as z from 'zod'

export default defineApi({
  schema: z.object({
    id: z.number().int().positive(),
  }),
  async handler({ params }) {
    const client = await getClient()
    const user = await client.query('users').select('id', 'name').where('id', params.id).first()

    if (!user)
      throw new HttpError({
        statusCode: 404,
        message: 'User not found',
      })

    return {
      user,
    }
  },
})
