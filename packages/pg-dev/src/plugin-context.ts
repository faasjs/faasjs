/**
 * Provided-context key for the injected worker-specific test database URLs.
 */
export const TYPED_PG_VITEST_DATABASE_URLS_KEY = '__typedPgVitestDatabaseUrls'

/**
 * Environment variable populated with the current worker's temporary database URL.
 */
export const TYPED_PG_VITEST_DATABASE_URL_ENV_NAME = 'DATABASE_URL'

/**
 * Tables preserved by the Vitest plugin while clearing test data between cases.
 */
export const TYPED_PG_VITEST_RESET_EXCLUDE_TABLES = ['typed_pg_migrations']

/**
 * Worker-to-URL map provided by the Vitest plugin global setup.
 */
export type TypedPgVitestDatabaseUrls = Record<string, string>

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
export function resolveTypedPgVitestWorkerId(env: NodeJS.ProcessEnv = process.env) {
  if (!env.VITEST_POOL_ID) {
    throw Error('TypedPgVitestPlugin requires VITEST_POOL_ID to resolve the worker database URL.')
  }

  return env.VITEST_POOL_ID
}

/**
 * Resolves the temporary database URL assigned to the current Vitest worker.
 *
 * @param {TypedPgVitestDatabaseUrls | undefined} databaseUrls - Worker-to-URL map provided by the
 * plugin global setup.
 * @param {string} [workerId] - Current worker identifier.
 * @returns Temporary database URL for the current worker.
 */
export function resolveTypedPgVitestDatabaseUrl(
  databaseUrls: TypedPgVitestDatabaseUrls | undefined,
  workerId = resolveTypedPgVitestWorkerId(),
) {
  if (!databaseUrls) return undefined

  return databaseUrls[workerId]
}

/**
 * Resolves the temporary database URL assigned to the current worker or throws.
 *
 * @param {TypedPgVitestDatabaseUrls | undefined} databaseUrls - Worker-to-URL map provided by the
 * plugin global setup.
 * @param {string} [workerId] - Current worker identifier.
 * @returns Temporary database URL for the current worker.
 */
export function requireTypedPgVitestDatabaseUrl(
  databaseUrls: TypedPgVitestDatabaseUrls | undefined,
  workerId = resolveTypedPgVitestWorkerId(),
) {
  const databaseUrl = resolveTypedPgVitestDatabaseUrl(databaseUrls, workerId)

  if (!databaseUrl) {
    throw Error(
      `TypedPgVitestPlugin did not provide a testing database URL for worker ${workerId}. Make sure the plugin is enabled in Vitest config.`,
    )
  }

  return databaseUrl
}

declare module 'vitest' {
  interface ProvidedContext {
    __typedPgVitestDatabaseUrls: TypedPgVitestDatabaseUrls
  }
}
