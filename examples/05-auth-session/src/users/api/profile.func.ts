import { defineApi } from '@faasjs/core'

export const func = defineApi({
  async handler({ knex, session }) {
    if (!knex) throw Error('Missing knex plugin')

    const userId = session.read('user_id')
    if (typeof userId !== 'number') throw Error('Unauthorized')

    const user = await knex('users').select('id', 'username').where({ id: userId }).first()

    if (!user) throw Error('Unauthorized')

    return user
  },
})
