import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('todos', (table) => {
    table.increments('id').primary()
    table.string('title', 200).notNullable()
    table.boolean('completed').notNullable().defaultTo(false)
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now())
  })

  await knex.schema.createTable('todo_audits', (table) => {
    table.increments('id').primary()
    table.integer('todo_id').notNullable().references('id').inTable('todos').onDelete('CASCADE')
    table.string('action', 50).notNullable()
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('todo_audits')
  await knex.schema.dropTableIfExists('todos')
}
