import { getClient } from '@faasjs/pg'
import postgres from 'postgres'

import { PG_VITEST_DATABASE_URL_ENV_NAME } from '../../plugin-context'

export async function requireFixtureDatabaseUrl() {
  await getClient()

  const databaseUrl = process.env[PG_VITEST_DATABASE_URL_ENV_NAME]

  if (!databaseUrl) {
    throw Error(
      `${PG_VITEST_DATABASE_URL_ENV_NAME} was not injected by PgVitestPlugin after await getClient()`,
    )
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
