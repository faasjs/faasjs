/**
 * Testing helpers and test-oriented re-exports for FaasJS packages.
 *
 * This entrypoint re-exports `@faasjs/core`, `testApi`, and `ApiTester` so
 * tests can load, mount, and invoke APIs without booting a full server.
 */
export * from '@faasjs/core'
export * from './func_warper.ts'
