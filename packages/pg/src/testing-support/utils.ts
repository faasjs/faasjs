import { PG_VITEST_DATABASE_URL_ENV_NAME } from '../../../pg-dev/src/plugin-context'

export { createTestingPostgres } from '../../../pg-dev/src/postgres'

export function requireTestingDatabaseUrl(databaseUrl?: string) {
  const resolvedDatabaseUrl = databaseUrl ?? process.env[PG_VITEST_DATABASE_URL_ENV_NAME]

  if (!resolvedDatabaseUrl) {
    throw Error('PgVitestPlugin requires process.env.DATABASE_URL to be set.')
  }

  return resolvedDatabaseUrl
}
