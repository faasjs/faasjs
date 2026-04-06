/**
 * FaasJS development toolkit for local servers, generated route types, and test helpers.
 *
 * [![License: MIT](https://img.shields.io/npm/l/@faasjs/dev.svg)](https://github.com/faasjs/faasjs/blob/main/packages/dev/LICENSE)
 * [![NPM Version](https://img.shields.io/npm/v/@faasjs/dev.svg)](https://www.npmjs.com/package/@faasjs/dev)
 *
 * ## Install
 *
 * ```sh
 * npm install -D @faasjs/dev
 * ```
 *
 * ## Features
 *
 * - `viteFaasJsServer()` runs a FaasJS server inside Vite during local development.
 * - `oxfmtConfig` and `oxlintConfig` expose the shared FaasJS formatting and lint rules.
 * - `generateFaasTypes()` emits route declarations for `@faasjs/types`.
 * - `test()` and {@link FuncWarper} help invoke and assert FaasJS functions in tests.
 *
 * ## Usage: Vite Integration
 *
 * ```ts
 * import { viteFaasJsServer, oxfmtConfig, oxlintConfig } from '@faasjs/dev'
 * import react from '@vitejs/plugin-react'
 * import { defineConfig } from 'vite-plus'
 *
 * export default defineConfig({
 *   plugins: [react(), viteFaasJsServer()],
 *   fmt: oxfmtConfig,
 *   lint: oxlintConfig,
 * })
 * ```
 *
 * ## Usage: Type Generation
 *
 * ```ts
 * import { generateFaasTypes } from '@faasjs/dev'
 *
 * await generateFaasTypes()
 * ```
 *
 * ## Usage: Test Helpers
 *
 * ```ts
 * import { test } from '@faasjs/dev'
 * import { func } from '../demo.func.ts'
 *
 * const wrapped = test(func)
 * const response = await wrapped.JSONhandler({ name: 'FaasJS' })
 *
 * expect(response.statusCode).toBe(200)
 * expect(response.data).toEqual({ message: 'Hello, FaasJS' })
 * ```
 *
 * ## API
 *
 * - Vite: {@link viteFaasJsServer}
 * - Config: {@link oxfmtConfig}, {@link oxlintConfig}
 * - Typegen: {@link generateFaasTypes}, {@link isTypegenSourceFile}
 * - Test: {@link test}, {@link FuncWarper}, {@link streamToString}, {@link streamToObject}, {@link stringToStream}, {@link objectToStream}
 */

export * from './configs'
export * from './test'
export * from './typegen'
export * from './vite'
