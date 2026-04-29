/**
 * @faasjs/pg-dev package.
 *
 * The published surface exposes `PgVitestPlugin` plus the low-level setup helper used by the
 * generated Vitest setup module.
 */
export { PgVitestPlugin } from './plugin'
export type { PgVitestSetupRuntime } from './setup-helper'
export { setupPgVitest } from './setup-helper'
