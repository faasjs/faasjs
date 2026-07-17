/**
 * # @faasjs/dev
 *
 * FaasJS development toolkit for local servers, generated API/job types, and test helpers.
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
 * - `ViteConfig` bundles the standard FaasJS React and Vite Plus defaults.
 * - `OxfmtConfig` and `OxlintConfig` expose the shared FaasJS formatting and lint rules.
 * - `generateFaasTypes()` emits API route and job declarations for `@faasjs/types`.
 * - `testApi()` and {@link ApiTester} help invoke and assert FaasJS APIs in tests.
 *
 * ## Usage: Shared Vite Preset
 *
 * ```ts
 * import { ViteConfig } from '@faasjs/dev'
 * import { defineConfig } from 'vite-plus'
 *
 * export default defineConfig({
 *   ...ViteConfig,
 * })
 * ```
 *
 * ## Usage: Manual Vite Integration
 *
 * ```ts
 * import { viteFaasJsServer, OxfmtConfig, OxlintConfig } from '@faasjs/dev'
 * import react from '@vitejs/plugin-react'
 * import { defineConfig } from 'vite-plus'
 *
 * export default defineConfig({
 *   plugins: [react(), viteFaasJsServer()],
 *   fmt: OxfmtConfig,
 *   lint: OxlintConfig,
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
 * import api from '../demo.api'
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
 * - Config: {@link ViteConfig}, {@link OxfmtConfig}, {@link OxlintConfig}
 * - Typegen: {@link generateFaasTypes}, {@link isTypegenInputFile}
 * - Test: {@link testApi}, {@link ApiTester}
 *
 * @packageDocumentation
 */

export * from './testing'
export * from './typegen'
export * from './vite'
