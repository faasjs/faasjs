import type { ExportedHandler, Func } from '@faasjs/func'
import { loadConfig } from './load_config'
import { loadPackage } from './load_package'

/**
 * Load a FaasJS function and its configuration, returning the handler.
 *
 * @param root Project root directory used to resolve configuration.
 * @param filename Path to the packaged FaasJS function file to load.
 * @param staging Staging directory name (used when locating config).
 * @returns A promise that resolves to the function handler.
 *
 * @example
 * ```ts
 * import { loadFunc } from '@faasjs/node-utils'
 *
 * const handler = await loadFunc(
 *   process.cwd(),
 *   __dirname + '/example.func.ts',
 *   'development'
 * )
 *
 * const result = await handler(event, context)
 * console.log(result)
 * ```
 */
export async function loadFunc<TEvent = any, TContext = any, TResult = any>(
  root: string,
  filename: string,
  staging: string
): Promise<ExportedHandler<TEvent, TContext, TResult>> {
  const func = await loadPackage<Func>(filename)

  func.config = await loadConfig(root, filename, staging)

  return func.export().handler
}
