import { defineApi, z } from '@faasjs/core'

const schema = z
  .object({
    username: z.string().min(3).max(100),
    password: z.string().min(6).max(200),
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
  async handler({ knex, params, session }) {
    if (!knex) throw Error('Missing knex plugin')

    const exists = await knex('users').select('id').where({ username: params.username }).first()

    if (exists) throw Error('Username already exists')

    const inserted = await knex('users')
      .insert({
        username: params.username,
        password: params.password,
      })
      .returning('id')

    const first = inserted[0]
    const id = parseInsertedId(first as number | string | Record<string, unknown>)

    session.write('user_id', id)

    return {
      id,
      username: params.username,
    }
  },
})
