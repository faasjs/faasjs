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
 * Installed Node module hooks remain active. This only resets the in-memory
 * root, tsconfig, path-alias, and cache-busting state used by {@link loadPackage}
 * and {@link registerNodeModuleHooks}.
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
 * Calling this function multiple times is safe. Hooks are installed once, while
 * loader state is refreshed from the latest options when a root, entry, or
 * tsconfig path can be inferred. The hooks resolve tsconfig `paths`,
 * extensionless local script imports, and optional cache-busting query strings
 * for project-local `file://` URLs.
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
 * Local file paths are converted to `file://` URLs, tsconfig-aware hooks are
 * installed when a project root can be inferred, and project-local file imports
 * can receive a version query string for cache busting. Bare package specifiers
 * and URL-scheme specifiers are imported as provided.
 *
 * The target module must provide a `default` export; named exports are not used
 * as a fallback.
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
