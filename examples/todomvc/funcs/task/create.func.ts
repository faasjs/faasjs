import { Func } from '@faasjs/func'
import { Http } from '@faasjs/http'
import { Knex } from '@faasjs/knex'

const http = new Http({
  validator: {
    params: {
      whitelist: 'error',
      rules: {
        name: {
          required: true,
          type: 'string',
        },
      },
    },
  },
})

const knex = new Knex()

export default new Func({
  plugins: [http, knex],
  async handler() {
    return await knex.query('tasks').insert({ name: http.params.name })
  },
})
