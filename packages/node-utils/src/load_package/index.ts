import { dirname } from 'node:path'

import { resolveLoadPackageSpecifier, resolveLoaderEntryPath } from './resolver'
import { loaderStates, ensureLoaderState, installModuleHooks } from './state'
import type { RegisterNodeModuleHooksOptions } from './types'

export type { RegisterNodeModuleHooksOptions } from './types'

export { parseTsconfig } from './tsconfig'
export {
  normalizeRoot,
  normalizeFileSystemPath,
  resolveLoaderEntryPath,
  resolveScriptFile,
  resolveLoadPackageSpecifier,
  resolveRuleSpecifier,
  resolveRelativeSpecifier,
} from './resolver'
export { findNearestFile, findNearestTsconfig, inferLoaderOptionsFromFile } from './finder'
export { loaderStates, buildLoaderState, ensureLoaderState, installModuleHooks } from './state'

/**
 * Clear cached loader state used by this module.
 *
 * Installed Node module hooks remain active. This only resets in-memory state used by
 * {@link loadPackage}.
 *
 * @example
 * ```ts
 * import { loadPackage, resetRuntime } from '@faasjs/node-utils'
 *
 * await loadPackage('./src/hello.api.ts')
 * resetRuntime()
 * ```
 */
export function resetRuntime(): void {
  loaderStates.clear()
}

/**
 * Install Node module hooks for tsconfig path aliases and TypeScript-friendly local imports.
 *
 * Calling this function multiple times is safe. Hooks are installed once, while loader state is refreshed
 * from the latest options when a root, entry, or tsconfig path can be inferred.
 *
 * @param {RegisterNodeModuleHooksOptions} options - Hook registration options such as entry file, root, tsconfig path, and cache-busting version. @default {}
 *
 * @example
 * ```ts
 * import { registerNodeModuleHooks } from '@faasjs/node-utils'
 *
 * registerNodeModuleHooks({
 *   root: process.cwd(),
 * })
 * ```
 */
export function registerNodeModuleHooks(options: RegisterNodeModuleHooksOptions = {}): void {
  const { entry, ...loadOptions } = options
  const resolvedEntry = resolveLoaderEntryPath(entry) || resolveLoaderEntryPath(process.argv[1])

  if (resolvedEntry || loadOptions.root || loadOptions.tsconfigPath) {
    const state = ensureLoaderState(
      resolvedEntry || loadOptions.root || loadOptions.tsconfigPath || process.cwd(),
      loadOptions,
    )

    if (!state && resolvedEntry && !loadOptions.root && !loadOptions.tsconfigPath) {
      ensureLoaderState(resolvedEntry, {
        ...loadOptions,
        root: dirname(resolvedEntry),
      })
    }
  }

  installModuleHooks()
}

/**
 * Load a module in the current Node ESM runtime and return its default export.
 *
 * The loader can install tsconfig-aware hooks and append a version query string to bust Node's
 * import cache for project-local files.
 *
 * @template T - The type of module to be loaded.
 * @param {string} name - Package name, file path, or module specifier to load.
 * @returns {Promise<T>} Loaded default export value.
 * @throws {Error} If the requested module fails to load or the default export is missing.
 *
 * @example
 * ```ts
 * import { loadPackage } from '@faasjs/node-utils'
 *
 * const api = await loadPackage('./src/hello.api.ts')
 * ```
 */
export async function loadPackage<T = unknown>(name: string): Promise<T> {
  const specifier = resolveLoadPackageSpecifier(name)

  let module: any

  if (ensureLoaderState(specifier, {})) installModuleHooks()

  module = await import(specifier)

  if ('default' in module) return module.default

  throw Error(`[loadPackage] Module "${name}" must export "default".`)
}
