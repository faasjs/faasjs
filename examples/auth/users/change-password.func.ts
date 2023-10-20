import { useFunc } from '@faasjs/func'
import { useKnex } from '@faasjs/knex'
import { useHttp } from '@faasjs/http'

export default useFunc(function () {
  const knex = useKnex()
  const http = useHttp({
    validator: {
      session: {
        rules: {
          user_id: {
            required: true,
            type: 'number',
          },
        },
      },
      params: {
        whitelist: 'error',
        rules: {
          new_password: {
            required: true,
            type: 'string',
          },
          old_password: {
            required: true,
            type: 'string',
          },
        },
      },
    },
  })

  return async function () {
    const row = await knex
      .query('users')
      .select('password')
      .where('id', '=', http.session.read('user_id'))
      .first()
    if (row.password !== http.params.old_password) {
      throw Error('旧密码错误')
    }
    await knex
      .query('users')
      .where('id', '=', http.session.read('user_id'))
      .update({
        password: http.params.new_password,
      })
  }
})
