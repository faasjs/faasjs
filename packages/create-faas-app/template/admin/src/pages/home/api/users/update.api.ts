import { defineApi, HttpError } from '@faasjs/core'
import { getClient } from '@faasjs/pg'
import { z } from '@faasjs/utils'

export default defineApi({
  schema: z.object({
    id: z.positiveint(),
    name: z.nonemptystring(),
  }),
  async handler({ params }) {
    const client = await getClient()
    const [user] = await client
      .query('users')
      .where('id', params.id)
      .update(
        {
          name: params.name,
        },
        {
          returning: ['id', 'name'],
        },
      )

    if (!user)
      throw new HttpError({
        statusCode: 404,
        message: 'User not found',
      })

    return {
      message: `Updated user #${user.id}`,
      user,
    }
  },
})
