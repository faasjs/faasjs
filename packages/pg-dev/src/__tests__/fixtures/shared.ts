import postgres from 'postgres'

import { TYPED_PG_VITEST_DATABASE_URL_ENV_NAME } from '../../plugin-context'

export function requireFixtureDatabaseUrl() {
  const databaseUrl = process.env[TYPED_PG_VITEST_DATABASE_URL_ENV_NAME]

  if (!databaseUrl) {
    throw Error(`${TYPED_PG_VITEST_DATABASE_URL_ENV_NAME} was not injected by TypedPgVitestPlugin`)
  }

  return databaseUrl
}

export function createFixturePostgres(databaseUrl = requireFixtureDatabaseUrl()) {
  return postgres(databaseUrl, { max: 1, ssl: false })
}

export async function withFixturePostgres<T>(
  run: (sql: ReturnType<typeof createFixturePostgres>, databaseUrl: string) => Promise<T>,
) {
  const databaseUrl = requireFixtureDatabaseUrl()
  const sql = createFixturePostgres(databaseUrl)

  try {
    return await run(sql, databaseUrl)
  } finally {
    await sql.end()
  }
}
