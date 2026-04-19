import type { SchemaBuilder } from '../../../schema-builder'

export function up(builder: SchemaBuilder) {
  builder.createTable('migrations', (table) => {
    table.string('id').primary()
    table.string('name')
    table.timestamps()
  })
}

export function down(builder: SchemaBuilder) {
  builder.dropTable('migrations')
}
