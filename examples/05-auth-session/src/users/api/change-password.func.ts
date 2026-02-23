import { defineApi, z } from '@faasjs/core'

const schema = z
  .object({
    oldPassword: z.string().min(6).max(200),
    newPassword: z.string().min(6).max(200),
  })
  .required()

export const func = defineApi({
  schema,
  async handler({ knex, params, session }) {
    if (!knex) throw Error('Missing knex plugin')

    const userId = session.read('user_id')
    if (typeof userId !== 'number') throw Error('Unauthorized')

    const user = await knex('users').select('password').where({ id: userId }).first()

    if (!user) throw Error('Unauthorized')

    if (user.password !== params.oldPassword) throw Error('Old password mismatch')

    await knex('users').where({ id: userId }).update({
      password: params.newPassword,
      updated_at: new Date(),
    })
  },
})
