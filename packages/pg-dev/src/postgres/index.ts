import postgres, { type PostgresType } from 'postgres'

import { PG_VITEST_DATABASE_URL_ENV_NAME } from '../plugin-context'

/**
 * Creates a `postgres.js` client configured for `@faasjs/pg` tests.
 *
 * Defaults to a single connection and disabled SSL so the client works with the bundled PGlite
 * socket server setup.
 *
 * @param {string} [databaseUrl] - Optional explicit testing database URL.
 * @returns Configured `postgres.js` client instance.
 */
export function createTestingPostgres<
  T extends Record<string, PostgresType> = Record<string, never>,
>(databaseUrl?: string) {
  const resolvedDatabaseUrl = databaseUrl ?? process.env[PG_VITEST_DATABASE_URL_ENV_NAME]

  if (!resolvedDatabaseUrl) {
    throw Error('PgVitestPlugin requires process.env.DATABASE_URL to be set.')
  }

  return postgres<T>(resolvedDatabaseUrl, {
    max: 1,
    ssl: false,
  })
}
