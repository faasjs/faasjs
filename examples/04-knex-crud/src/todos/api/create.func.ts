import { defineApi, transaction, z } from '@faasjs/core'

const schema = z
  .object({
    title: z.string().min(1).max(200),
  })
  .required()

function parseInsertedId(value: number | string | Record<string, unknown>): number {
  if (typeof value === 'number') return value

  if (typeof value === 'string') return Number.parseInt(value, 10)

  const id = (value as { id?: number | string }).id
  if (typeof id === 'number') return id
  if (typeof id === 'string') return Number.parseInt(id, 10)

  throw Error('Invalid inserted id')
}

export const func = defineApi({
  schema,
  async handler({ params }) {
    return await transaction(async (trx) => {
      const inserted = await trx('todos')
        .insert({
          title: params.title,
          completed: false,
        })
        .returning('id')

      const first = inserted[0]
      const id = parseInsertedId(first as number | string | Record<string, unknown>)

      await trx('todo_audits').insert({
        todo_id: id,
        action: 'create',
      })

      const todo = await trx('todos').select('id', 'title', 'completed').where({ id }).first()

      if (!todo) throw Error('Todo not found after create')

      return todo
    })
  },
})
