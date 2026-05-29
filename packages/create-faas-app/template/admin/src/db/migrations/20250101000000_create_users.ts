import type { SchemaBuilder } from '@faasjs/pg'

export function up(builder: SchemaBuilder) {
  builder.createTable('users', (table) => {
    table.specificType('id', 'serial').primary()
    table.string('name')
  })
}

export function down(builder: SchemaBuilder) {
  builder.dropTable('users')
}
