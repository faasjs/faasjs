import { Func } from '@faasjs/func'
import { Http } from '@faasjs/http'
import { Knex } from '@faasjs/knex'

const http = new Http({
  validator: {
    params: {
      whitelist: 'error',
      rules: {
        id: {
          required: true,
          type: 'number',
        },
      },
    },
  },
})

const knex = new Knex()

export default new Func({
  plugins: [http, knex],
  async handler() {
    return await knex.query('task').where({ id: http.params.id }).delete()
  },
})
