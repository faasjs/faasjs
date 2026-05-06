/**
 * Tables preserved by the Vitest plugin while clearing test data between cases.
 */
export const PG_VITEST_RESET_EXCLUDE_TABLES = ['faasjs_pg_migrations']

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
