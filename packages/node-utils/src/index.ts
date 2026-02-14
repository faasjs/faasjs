/**
 * FaasJS Node.js utility toolkit.
 *
 * [![License: MIT](https://img.shields.io/npm/l/@faasjs/node-utils.svg)](https://github.com/faasjs/faasjs/blob/main/packages/node-utils/LICENSE)
 * [![NPM Version](https://img.shields.io/npm/v/@faasjs/node-utils.svg)](https://www.npmjs.com/package/@faasjs/node-utils)
 *
 * ## Install
 *
 * ```sh
 * npm install @faasjs/node-utils
 * ```
 *
 * @packageDocumentation
 */

export { deepMerge } from './deep_merge'
export { loadConfig } from './load_config'
export { loadFunc } from './load_func'
export type { NodeRuntime } from './load_package'
export { detectNodeRuntime, loadPackage, resetRuntime } from './load_package'
export { streamToObject, streamToString, streamToText } from './stream'
