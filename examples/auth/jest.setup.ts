import { useKnex } from '@faasjs/knex'

let knex

global.beforeEach(async () => {
  knex = useKnex({
    name: 'knex',
    config: {
      client: 'sqlite3',
      connection: {
        filename: ':memory:',
      },
    },
  })

  await knex.mount()

  await knex.raw(
    'CREATE TABLE IF NOT EXISTS "users" ("id" integer,"username" varchar UNIQUE,"password" varchar, PRIMARY KEY (id));'
  )
  await knex.raw('DELETE FROM users;')
})

global.afterAll(async () => {
  await knex.quit()
})
