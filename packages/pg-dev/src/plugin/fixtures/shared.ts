import { getClient } from '@faasjs/pg'
import postgres from 'postgres'

export async function requireFixtureDatabaseUrl() {
  await getClient()

  const databaseUrl = process.env.DATABASE_URL

  if (!databaseUrl) {
    throw Error(`'DATABASE_URL' was not injected by PgVitestPlugin after await getClient()`)
  }

  return databaseUrl
}

export async function createFixturePostgres(databaseUrl?: string) {
  return postgres(databaseUrl ?? (await requireFixtureDatabaseUrl()), { max: 1, ssl: false })
}

export async function withFixturePostgres<T>(
  run: (sql: Awaited<ReturnType<typeof createFixturePostgres>>, databaseUrl: string) => Promise<T>,
) {
  const databaseUrl = await requireFixtureDatabaseUrl()
  const sql = await createFixturePostgres(databaseUrl)

  try {
    return await run(sql, databaseUrl)
  } finally {
    await sql.end()
  }
}
