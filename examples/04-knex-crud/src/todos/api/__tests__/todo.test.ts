import { Func, Knex, KnexSchema } from '@faasjs/core'
import { test } from '@faasjs/dev'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { func as createFunc } from '../create.func'
import { func as listFunc } from '../list.func'
import { func as removeFunc } from '../remove.func'
import { func as toggleFunc } from '../toggle.func'

type Todo = {
  id: number
  title: string
  completed: boolean
}

async function mountKnex(knex: Knex): Promise<void> {
  const handler = new Func({
    plugins: [knex],
    async handler() {
      return null
    },
  }).export().handler

  await handler({})
}

describe('todos api', () => {
  const createApi = test(createFunc)
  const listApi = test(listFunc)
  const toggleApi = test(toggleFunc)
  const removeApi = test(removeFunc)

  let knex: Knex

  beforeAll(async () => {
    knex = new Knex({
      name: 'knex',
      config: {
        client: 'pglite',
        connection: './.pglite_test',
        migrations: {
          directory: './src/db/migrations',
          extension: 'ts',
        },
      },
    })

    await mountKnex(knex)

    const schema = new KnexSchema(knex)
    await schema.migrateLatest()
  })

  beforeEach(async () => {
    await knex.query('todo_audits').delete()
    await knex.query('todos').delete()
  })

  afterAll(async () => {
    await knex.quit()
  })

  it('creates and lists todos', async () => {
    const first = await createApi.JSONhandler({ title: 'write docs' })
    const second = await createApi.JSONhandler({ title: 'ship release' })

    expect(first.statusCode).toBe(200)
    expect(second.statusCode).toBe(200)

    const listed = await listApi.JSONhandler({})
    const items = listed.data as Todo[]

    expect(listed.statusCode).toBe(200)
    expect(items).toHaveLength(2)
    expect(items.map((item) => item.title)).toEqual(['write docs', 'ship release'])
  })

  it('toggles and removes todo', async () => {
    const created = await createApi.JSONhandler({ title: 'toggle me' })
    const todo = created.data as Todo

    const toggled = await toggleApi.JSONhandler({
      id: todo.id,
      completed: true,
    })

    expect(toggled.statusCode).toBe(200)
    expect(toggled.data).toMatchObject({
      id: todo.id,
      title: 'toggle me',
      completed: true,
    })

    const removed = await removeApi.JSONhandler({ id: todo.id })
    expect(removed.statusCode).toBe(204)

    const listed = await listApi.JSONhandler({})
    expect((listed.data as Todo[])).toHaveLength(0)
  })
})
