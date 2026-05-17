import type { SchemaBuilder } from '@faasjs/pg'

export function up(builder: SchemaBuilder) {
  builder.raw(`
    CREATE TABLE IF NOT EXISTS widgets (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL
    )
  `)

  builder.raw(`
    CREATE TABLE IF NOT EXISTS widget_logs (
      id INTEGER PRIMARY KEY,
      widget_id INTEGER NOT NULL REFERENCES widgets(id)
    )
  `)
}
