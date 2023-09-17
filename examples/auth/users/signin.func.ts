import { useFunc } from '@faasjs/func'
import { useKnex } from '@faasjs/knex'
import { useHttp } from '@faasjs/http'

export default useFunc(function () {
  const knex = useKnex()
  const http = useHttp<{
    username: string
    password: string
  }>({
    validator: {
      params: {
        whitelist: 'error',
        rules: {
          username: {
            required: true,
            type: 'string',
          },
          password: {
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
      .select('id', 'password')
      .where('username', '=', http.params.username)
      .first()

    if (!row) {
      throw Error('用户名错误')
    }

    if (row.password !== http.params.password) {
      throw Error('用户名或密码错误')
    }

    http.session.write('user_id', row.id)
  }
})
