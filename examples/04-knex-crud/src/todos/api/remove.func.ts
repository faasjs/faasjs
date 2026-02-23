import { defineApi, query, z } from '@faasjs/core'

const schema = z
  .object({
    id: z.number().int().positive(),
  })
  .required()

export const func = defineApi({
  schema,
  async handler({ params }) {
    const removed = await query('todos').where({ id: params.id }).delete()

    if (!removed) throw Error('Todo not found')
  },
})
