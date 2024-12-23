/**
 * FaasJS's logger module.
 *
 * [![License: MIT](https://img.shields.io/npm/l/@faasjs/logger.svg)](https://github.com/faasjs/faasjs/blob/main/packages/logger/LICENSE)
 * [![NPM Version](https://img.shields.io/npm/v/@faasjs/logger.svg)](https://www.npmjs.com/package/@faasjs/logger)
 *
 * ## Install
 *
 * ```sh
 * npm install @faasjs/logger
 * ```
 *
 * ## Usage
 *
 * ```typescript
 * import { Logger } from '@faasjs/logger'
 *
 * const logger = new Logger()
 *
 * logger.debug('debug message')
 * logger.info('info message')
 * logger.warn('warn message')
 * logger.error('error message')
 * ```
 *
 * ### Support environment variables
 *
 * - **FaasLog**: debug, info, warn, error (default: debug)
 * - **FaasLogSize**: 1000 (default: 1000, 0 for unlimited)
 * - **FaasLogMode**: plain, pretty (default: pretty)
 *
 * @packageDocumentation
 */

export * from './color'
export * from './logger'
