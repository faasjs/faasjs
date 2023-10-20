import { Knex } from '@faasjs/knex'

let knex

global.beforeEach(async () => {
  knex = new Knex({
    name: 'knex',
    config: {
      client: 'sqlite3',
      connection: {
        filename: 'testing.splite3',
      },
    },
  })

  await knex.onMount(
    {
      config: {},
      event: {},
      context: {},
    },
    async () => {}
  )

  await knex.raw(
    'CREATE TABLE IF NOT EXISTS "users" ("id" integer,"username" varchar UNIQUE,"password" varchar, PRIMARY KEY (id));'
  )
  await knex.raw('DELETE FROM users;')
})

global.afterAll(async () => {
  await knex.quit()
})
