import { defineApi, query, z } from '@faasjs/core'

const schema = z
  .object({
    id: z.number().int().positive(),
    completed: z.boolean(),
  })
  .required()

export const func = defineApi({
  schema,
  async handler({ params }) {
    const updatedCount = await query('todos')
      .where({ id: params.id })
      .update({
        completed: params.completed,
        updated_at: new Date(),
      })

    if (!updatedCount) throw Error('Todo not found')

    const todo = await query('todos').select('id', 'title', 'completed').where({ id: params.id }).first()

    if (!todo) throw Error('Todo not found')

    return todo
  },
})
