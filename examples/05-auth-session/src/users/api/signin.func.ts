import { defineApi, z } from '@faasjs/core'

const schema = z
  .object({
    username: z.string().min(3).max(100),
    password: z.string().min(6).max(200),
  })
  .required()

export const func = defineApi({
  schema,
  async handler({ knex, params, session }) {
    if (!knex) throw Error('Missing knex plugin')

    const user = await knex('users').select('id', 'username', 'password').where({ username: params.username }).first()

    if (!user || user.password !== params.password) {
      throw Error('Invalid username or password')
    }

    session.write('user_id', user.id)

    return {
      id: user.id,
      username: user.username,
    }
  },
})
