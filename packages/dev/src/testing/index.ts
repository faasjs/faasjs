/**
 * Testing helpers and test-oriented re-exports for FaasJS packages.
 *
 * This entrypoint re-exports `@faasjs/core` plus `FuncWarper` so tests can
 * load, mount, and invoke functions without booting a full server.
 */
export * from '@faasjs/core'
export * from './func_warper.ts'
