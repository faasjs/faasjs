/**
 * # @faasjs/core
 *
 * FaasJS core package.
 *
 * [![License: MIT](https://img.shields.io/npm/l/@faasjs/core.svg)](https://github.com/faasjs/faasjs/blob/main/packages/core/LICENSE)
 * [![NPM Version](https://img.shields.io/npm/v/@faasjs/core.svg)](https://www.npmjs.com/package/@faasjs/core)
 *
 * ## Install
 *
 * ```sh
 * npm install @faasjs/core
 * ```
 *
 * The package exports function lifecycle primitives, HTTP API helpers, middleware,
 * and the local HTTP server. The package default export is the built-in
 * {@link Http} plugin.
 *
 * @packageDocumentation
 */

export * from './define-api'
export * from './func'
export * from './plugins/http'
export { default } from './plugins/http'
export * from './middleware'
export * from './server'
export * from './utils'
