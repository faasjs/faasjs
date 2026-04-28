import type { Func } from '@faasjs/core'

import { loadPackage } from '../load_package'
import { loadPlugins } from './load_plugins'

/**
 * Promise-based handler signature exported by packaged FaasJS API modules.
 *
 * @template TEvent - Runtime event type.
 * @template TContext - Runtime context type.
 * @template TResult - Async result type returned by the handler.
 * @param {TEvent} [event] - Runtime event payload passed to the handler.
 * @param {TContext} [context] - Runtime context object passed to the handler.
 * @returns {Promise<TResult>} Promise that resolves to the handler result.
 */
export type ExportedHandler<TEvent = any, TContext = any, TResult = any> = (
  event?: TEvent,
  context?: TContext,
) => Promise<TResult>

/**
 * Load a packaged FaasJS API file, attach its resolved config, and return the exported handler.
 *
 * The loaded module is expected to expose an `export()` method that returns an object with a `handler`.
 *
 * @template TEvent - Runtime event type.
 * @template TContext - Runtime context type.
 * @template TResult - Async result type returned by the handler.
 * @param {string} root - Project root directory used to resolve configuration.
 * @param {string} filename - Path to the packaged FaasJS API file to load.
 * @param {string} staging - Staging name used when locating config.
 * @returns {Promise<ExportedHandler<TEvent, TContext, TResult>>} Promise that resolves to the API handler.
 * @throws {Error} If the API module or its `faas.yaml` configuration cannot be loaded.
 *
 * @example
 * ```ts
 * import { loadApiHandler } from '@faasjs/node-utils'
 *
 * const handler = await loadApiHandler(
 *   process.cwd(),
 *   __dirname + '/example.api.ts',
 *   'development'
 * )
 *
 * const result = await handler(event, context)
 * console.log(result)
 * ```
 */
export async function loadApiHandler<TEvent = any, TContext = any, TResult = any>(
  root: string,
  filename: string,
  staging: string,
): Promise<ExportedHandler<TEvent, TContext, TResult>> {
  const api = await loadPackage<Func<TEvent, TContext, TResult>>(filename)

  if (!api || typeof api.export !== 'function')
    throw Error(`API module "${filename}" must export a FaasJS API instance as default`)

  await loadPlugins(api, {
    root,
    filename,
    staging,
  })

  return api.export().handler
}
