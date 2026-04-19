import { describe, expect, it } from 'vitest'

import { startPGliteServer } from '../pglite'
import { createTestingPostgres } from '../postgres'
import { resetTestingDatabase } from '../testing'

describe('testing helpers', () => {
  it('truncates public tables while preserving excluded tables', async () => {
    const testingServer = await startPGliteServer()
    const sql = createTestingPostgres(testingServer.databaseUrl)

    try {
      await sql`CREATE TABLE users (id SERIAL PRIMARY KEY, name TEXT NOT NULL)`
      await sql`CREATE TABLE typed_pg_migrations (name TEXT PRIMARY KEY)`
      await sql`INSERT INTO users (name) VALUES ('Alice')`
      await sql`INSERT INTO typed_pg_migrations (name) VALUES ('keep me')`

      await resetTestingDatabase(sql, ['typed_pg_migrations'])

      expect(await sql`SELECT * FROM users`).toEqual([])
      expect(await sql`SELECT * FROM typed_pg_migrations`).toEqual([{ name: 'keep me' }])
    } finally {
      await sql.end()
      await testingServer.stop()
    }
  })

  it('skips truncation when every discovered table is excluded by schema-qualified name', async () => {
    const testingServer = await startPGliteServer()
    const sql = createTestingPostgres(testingServer.databaseUrl)

    try {
      await sql`CREATE TABLE users (id SERIAL PRIMARY KEY, name TEXT NOT NULL)`
      await sql`INSERT INTO users (name) VALUES ('Alice')`

      await resetTestingDatabase(sql, ['public.users'])

      expect(await sql`SELECT * FROM users`).toEqual([{ id: 1, name: 'Alice' }])
    } finally {
      await sql.end()
      await testingServer.stop()
    }
  })
})
