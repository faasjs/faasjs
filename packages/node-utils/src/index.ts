/**
 * # @faasjs/node-utils
 *
 * FaasJS utilities for Node.js runtimes and local development workflows.
 *
 * The package bundles logging helpers, shared transport primitives, `faas.yaml`
 * configuration loaders, schema parsing helpers, filesystem guards, and
 * runtime-aware module loading helpers for Node.js.
 *
 * ## Install
 *
 * ```sh
 * npm install @faasjs/node-utils
 * ```
 *
 * ## Usage
 *
 * ```ts
 * import { z } from '@faasjs/utils'
 * import { Logger, loadConfig, parseSchemaValue } from '@faasjs/node-utils'
 *
 * const logger = new Logger('app')
 * const config = loadConfig(process.cwd(), '/project/src/hello.api.ts', 'development')
 * const params = await parseSchemaValue({
 *   schema: z.object({
 *     page: z.coerce.number().default(1),
 *   }),
 *   value: { page: '1' },
 *   errorMessage: 'Invalid params',
 * })
 *
 * logger.info('Loaded config %o with params %o', config, params)
 * ```
 *
 * @packageDocumentation
 */

export { colorize, Color, LevelColor } from './color'
export type { Level } from './logger'
export { formatLogger, Logger } from './logger'
export { isPathInsideRoot } from './is-path-inside-root'
export type { RegisterNodeModuleHooksOptions } from './load-package'
export { loadPackage, registerNodeModuleHooks, resetRuntime } from './load-package'
export type { FuncConfig, FuncPluginConfig } from './runtime-loading/load-config'
export { loadConfig } from './runtime-loading/load-config'
export type { ExportedHandler } from './runtime-loading/load-api-handler'
export { loadApiHandler } from './runtime-loading/load-api-handler'
export type { LoadPluginsOptions } from './runtime-loading/load-plugins'
export { loadPlugins } from './runtime-loading/load-plugins'
export type { ParseSchemaValueOptions, SchemaOutput } from './schema'
export { formatSchemaError, parseSchemaValue } from './schema'
export type { LoggerMessage, TransportHandler, TransportOptions } from './transport'
export { getTransport, Transport } from './transport'
