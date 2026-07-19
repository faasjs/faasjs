/**
 * Tables preserved by the Vitest plugin while clearing test data between cases.
 */
export const PG_VITEST_RESET_EXCLUDE_TABLES = ['faasjs_pg_migrations']

/**
 * Vitest context key used to share the run-scoped migration snapshot directory with test files.
 */
export const PG_VITEST_SNAPSHOT_DIR_CONTEXT_KEY = '__faasjsPgVitestSnapshotDir'

/**
 * Resolves the current Vitest worker identifier for diagnostics and isolation assertions.
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
