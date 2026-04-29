/**
 * Provided-context key for the injected worker-specific test database URLs.
 */
export const PG_VITEST_DATABASE_URLS_KEY = '__pgVitestDatabaseUrls'

/**
 * Environment variable populated with the current worker's temporary database URL.
 */
export const PG_VITEST_DATABASE_URL_ENV_NAME = 'DATABASE_URL'

/**
 * Tables preserved by the Vitest plugin while clearing test data between cases.
 */
export const PG_VITEST_RESET_EXCLUDE_TABLES = ['faasjs_pg_migrations']

/**
 * Worker-to-URL map provided by the Vitest plugin global setup.
 */
export type PgVitestDatabaseUrls = Record<string, string>

/**
 * Resolves the current Vitest worker identifier.
 *
 * The plugin uses `VITEST_POOL_ID` so global setup can pre-provision one temporary database per
 * pool slot.
 *
 * @param {NodeJS.ProcessEnv} [env] - Environment object to inspect.
 * @returns Current worker identifier.
 * @throws {Error} When Vitest does not expose a pool id for the current worker.
 */
export function resolvePgVitestWorkerId(env: NodeJS.ProcessEnv = process.env) {
  if (!env.VITEST_POOL_ID) {
    throw Error('PgVitestPlugin requires VITEST_POOL_ID to resolve the worker database URL.')
  }

  return env.VITEST_POOL_ID
}

/**
 * Resolves the temporary database URL assigned to the current Vitest worker.
 *
 * @param {PgVitestDatabaseUrls | undefined} databaseUrls - Worker-to-URL map provided by the
 * plugin global setup.
 * @param {string} [workerId] - Current worker identifier.
 * @returns Temporary database URL for the current worker.
 */
export function resolvePgVitestDatabaseUrl(
  databaseUrls: PgVitestDatabaseUrls | undefined,
  workerId = resolvePgVitestWorkerId(),
) {
  if (!databaseUrls) return undefined

  return databaseUrls[workerId]
}

/**
 * Resolves the temporary database URL assigned to the current worker or throws.
 *
 * @param {PgVitestDatabaseUrls | undefined} databaseUrls - Worker-to-URL map provided by the
 * plugin global setup.
 * @param {string} [workerId] - Current worker identifier.
 * @returns Temporary database URL for the current worker.
 */
export function requirePgVitestDatabaseUrl(
  databaseUrls: PgVitestDatabaseUrls | undefined,
  workerId = resolvePgVitestWorkerId(),
) {
  const databaseUrl = resolvePgVitestDatabaseUrl(databaseUrls, workerId)

  if (!databaseUrl) {
    throw Error(
      `PgVitestPlugin did not provide a testing database URL for worker ${workerId}. Make sure the plugin is enabled in Vitest config.`,
    )
  }

  return databaseUrl
}

declare module 'vitest' {
  interface ProvidedContext {
    __pgVitestDatabaseUrls: PgVitestDatabaseUrls
  }
}
