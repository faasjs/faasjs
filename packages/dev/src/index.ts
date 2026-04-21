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
 * - `viteConfig` bundles the standard FaasJS React and Vite Plus defaults.
 * - `oxfmtConfig` and `oxlintConfig` expose the shared FaasJS formatting and lint rules.
 * - `generateFaasTypes()` emits route declarations for `@faasjs/types`.
 * - `testApi()` and {@link ApiTester} help invoke and assert FaasJS APIs in tests.
 *
 * ## Usage: Shared Vite Preset
 *
 * ```ts
 * import { viteConfig } from '@faasjs/dev'
 * import { defineConfig } from 'vite-plus'
 *
 * export default defineConfig({
 *   ...viteConfig,
 * })
 * ```
 *
 * ## Usage: Manual Vite Integration
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
 * import { testApi } from '@faasjs/dev'
 * import api from '../demo.api.ts'
 *
 * const handler = testApi(api)
 * const response = await handler({ name: 'FaasJS' })
 *
 * expect(response.statusCode).toBe(200)
 * expect(response.data).toEqual({ message: 'Hello, FaasJS' })
 * ```
 *
 * ## API
 *
 * - Vite: {@link viteFaasJsServer}
 * - Config: {@link viteConfig}, {@link oxfmtConfig}, {@link oxlintConfig}
 * - Typegen: {@link generateFaasTypes}, {@link isTypegenInputFile}
 * - Test: {@link testApi}, {@link ApiTester}, {@link streamToString}, {@link streamToObject}, {@link stringToStream}, {@link objectToStream}
 */

export * from './testing'
export * from './typegen'
export * from './vite'
