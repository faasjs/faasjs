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
    await knex.raw('INSERT INTO users (username,password) VALUES (?, ?)', [
      http.params.username,
      http.params.password,
    ])

    const row = await knex.raw(
      'SELECT id FROM users WHERE username = ? LIMIT 1',
      [http.params.username]
    )

    http.session.write('user_id', row[0].id)
  }
})
