/**
 * FaasJS development toolkit for local development and testing.
 *
 * [![License: MIT](https://img.shields.io/npm/l/@faasjs/dev.svg)](https://github.com/faasjs/faasjs/blob/main/packages/dev/LICENSE)
 * [![NPM Version](https://img.shields.io/npm/v/@faasjs/dev.svg)](https://www.npmjs.com/package/@faasjs/dev)
 *
 * ## Install
 *
 * ```sh
 * npm install @faasjs/dev
 * ```
 *
 * ## Features
 *
 * - Vite integration for in-process FaasJS API during local development.
 * - PGlite helpers for lightweight database setup in tests.
 * - Test helpers to invoke and assert FaasJS functions.
 *
 * ## Usage: Vite integration
 *
 * ```ts
 * import { viteFaasJsServer } from '@faasjs/dev'
 *
 * export default defineConfig({
 *   plugins: [viteFaasJsServer()],
 * })
 * ```
 *
 * ## Usage: PGlite helpers
 *
 * ```ts
 * import {
 *   createPgliteKnex,
 *   mountFaasKnex,
 *   unmountFaasKnex,
 * } from '@faasjs/dev'
 *
 * const db = createPgliteKnex()
 * mountFaasKnex(db)
 *
 * // run tests...
 *
 * await db.destroy()
 * unmountFaasKnex()
 * ```
 *
 * ## Usage: Test helpers
 *
 * ```ts
 * import { test } from '@faasjs/dev'
 * import Func from '../demo.func.ts'
 *
 * const func = test(Func)
 * const response = await func.JSONhandler({ name: 'FaasJS' })
 *
 * expect(response.statusCode).toBe(200)
 * expect(response.data).toEqual({ message: 'Hello, FaasJS' })
 * ```
 *
 * ## API
 *
 * - Vite: {@link viteFaasJsServer}
 * - PGlite: {@link createPgliteKnex}, {@link mountFaasKnex}, {@link unmountFaasKnex}, {@link MountFaasKnexOptions}
 * - Test: {@link test}, {@link FuncWarper}, {@link streamToString}
 *
 * @packageDocumentation
 */

export * from './pglite'
export * from './test'
export * from './typegen'
export * from './vite'
