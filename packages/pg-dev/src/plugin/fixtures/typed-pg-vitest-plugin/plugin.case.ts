import { expect, it } from 'vitest'

import { withFixturePostgres } from '../shared'

it('runs migrations before tests start', async () => {
  await withFixturePostgres(async (sql, databaseUrl) => {
    expect(databaseUrl).toMatch(/^postgresql:/)
    expect(await sql`SELECT to_regclass('public.users') AS name`).toEqual([{ name: 'users' }])
    expect(await sql`SELECT COUNT(*)::integer AS count FROM typed_pg_migrations`).toEqual([
      { count: 1 },
    ])

    await sql`INSERT INTO users (id, name) VALUES (1, 'Alice')`
    expect(await sql`SELECT COUNT(*)::integer AS count FROM users`).toEqual([{ count: 1 }])
  })
})

it('clears user tables but keeps migration history before each test', async () => {
  await withFixturePostgres(async (sql) => {
    expect(await sql`SELECT COUNT(*)::integer AS count FROM users`).toEqual([{ count: 0 }])
    expect(await sql`SELECT COUNT(*)::integer AS count FROM typed_pg_migrations`).toEqual([
      { count: 1 },
    ])
  })
})
