import { expect, it } from 'vitest'

import { withFixturePostgres } from '../shared'

it('runs raw SQL migrations through SchemaBuilder.run', async () => {
  await withFixturePostgres(async (sql) => {
    expect(await sql`SELECT to_regclass('public.widgets') AS name`).toEqual([{ name: 'widgets' }])
    expect(await sql`SELECT to_regclass('public.widget_logs') AS name`).toEqual([
      { name: 'widget_logs' },
    ])
    expect(await sql`SELECT COUNT(*)::integer AS count FROM typed_pg_migrations`).toEqual([
      { count: 1 },
    ])
  })
})
