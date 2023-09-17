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
        name: {
          type: 'string',
        },
        completed: {
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
    if (http.params.name) {
      await knex
        .query('tasks')
        .where({ id: http.params.id })
        .update({ name: http.params.name })
    }

    if (typeof http.params.completed !== 'undefined') {
      await knex
        .query('tasks')
        .where({ id: http.params.id })
        .update({ completed: http.params.completed })
    }
  },
})
