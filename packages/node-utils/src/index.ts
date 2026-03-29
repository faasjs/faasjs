/**
 * FaasJS utilities for Node.js runtimes and local development workflows.
 *
 * The package bundles logging helpers, transport primitives, `faas.yaml`
 * configuration loaders, and runtime-aware module loading helpers for Node.js.
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
 * import { Logger, loadConfig } from '@faasjs/node-utils'
 *
 * const logger = new Logger('app')
 * const config = loadConfig(process.cwd(), '/project/src/hello.func.ts', 'development')
 *
 * logger.info('Loaded config %o', config)
 * ```
 */

export { colorfy, Color, LevelColor } from './color'
export type { Level } from './logger'
export { formatLogger, Logger } from './logger'
export type { FuncConfig, FuncPluginConfig } from './load_config'
export { loadConfig } from './load_config'
export type { LoadEnvFileIfExistsOptions } from './load_env'
export { loadEnvFileIfExists } from './load_env'
export type { ExportedHandler } from './load_func'
export { loadFunc } from './load_func'
export type {
  LoadPackageOptions,
  NodeRuntime,
  RegisterNodeModuleHooksOptions,
} from './load_package'
export {
  detectNodeRuntime,
  loadPackage,
  registerNodeModuleHooks,
  resetRuntime,
} from './load_package'
export type { LoggerMessage, TransportHandler, TransportOptions } from './transport'
export { getTransport, Transport } from './transport'
