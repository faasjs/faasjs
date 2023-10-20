import { Func } from '@faasjs/func'
import { Http } from '@faasjs/http'
import { Knex } from '@faasjs/knex'

const http = new Http()
const knex = new Knex()

export default new Func({
  plugins: [http, knex],
  async handler() {
    await knex.query('tasks').update({ completed: 1 })
  },
})
