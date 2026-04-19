/**
 * @faasjs/pg-dev package.
 *
 * The published surface exposes `TypedPgVitestPlugin` plus the low-level setup helper used by the
 * generated Vitest setup module.
 */
export type { TypedPgVitestPluginOptions } from './plugin'
export { TypedPgVitestPlugin } from './plugin'
export type { TypedPgVitestSetupRuntime } from './setup-helper'
export { setupTypedPgVitest } from './setup-helper'
