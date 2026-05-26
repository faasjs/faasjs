import { existsSync, statSync } from 'node:fs'
import { registerHooks } from 'node:module'
import { dirname, isAbsolute, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

import { isPathInsideRoot } from '../is-path-inside-root/index.ts'
import { inferLoaderOptionsFromFile } from './finder'
import {
  normalizeRoot,
  normalizeFileSystemPath,
  toFilePath,
  resolveRuleSpecifier,
  resolveRelativeSpecifier,
  isRelativeSpecifier,
  hasUrlScheme,
  withVersion,
  pickResolveState,
} from './resolver'
import { parseTsconfig } from './tsconfig'
import type { LoaderState, LoaderOptions } from './types'

/**
 * Map of loader states keyed by project root, shared across all loaders in the current process.
 *
 * @see {@link buildLoaderState}
 * @see {@link ensureLoaderState}
 */
export const loaderStates = new Map<string, LoaderState>()
/**
 * Whether the Node.js module resolution hooks have been installed by {@link installModuleHooks}.
 */
export let hooksInstalled = false

/**
 * Build a loader state by parsing the tsconfig at the given path.
 *
 * When the tsconfig file does not exist the returned state has no path-alias rules.
 *
 * @param {string} root - Project root directory.
 * @param {string} tsconfigPath - Path to the tsconfig to parse.
 * @param {string} version - Version token for cache busting.
 * @returns {LoaderState} Built loader state with base URL and path-alias rules.
 */
export function buildLoaderState(root: string, tsconfigPath: string, version: string): LoaderState {
  const mtimeMs = existsSync(tsconfigPath) ? statSync(tsconfigPath).mtimeMs : -1

  if (mtimeMs < 0)
    return {
      root,
      tsconfigPath,
      tsconfigMtimeMs: -1,
      baseUrl: root,
      rules: [],
      version,
    }

  const parsed = parseTsconfig(tsconfigPath)

  return {
    root,
    tsconfigPath,
    tsconfigMtimeMs: mtimeMs,
    baseUrl: parsed.baseUrl,
    rules: parsed.rules,
    version,
  }
}

/**
 * Retrieve or create a loader state for a specifier or path, inferring root and tsconfig when not explicitly given.
 *
 * If a state already exists for the resolved root and its tsconfig hasn't changed, the
 * existing state is reused and its version is updated.
 *
 * @param {string} name - Module specifier or file path used to infer loader options.
 * @param {LoaderOptions} options - Loader options such as explicit root, tsconfig path, and cache-busting version.
 * @returns {LoaderState | undefined} Created or existing loader state, or `undefined` if no root could be determined.
 */
export function ensureLoaderState(name: string, options: LoaderOptions): LoaderState | undefined {
  let root = options.root ? normalizeRoot(options.root) : ''
  let tsconfigPath = options.tsconfigPath ? normalizeFileSystemPath(options.tsconfigPath) : ''

  if (!root && tsconfigPath) root = normalizeRoot(dirname(tsconfigPath))

  if (!root) {
    const filePath = toFilePath(name)

    if (filePath) {
      const inferredOptions = inferLoaderOptionsFromFile(filePath)

      root = inferredOptions.root || ''
      tsconfigPath = inferredOptions.tsconfigPath || tsconfigPath
    }
  }

  if (!root) return undefined

  if (!tsconfigPath) tsconfigPath = join(root, 'tsconfig.json')

  const version = options.version ?? process.env.FAASJS_MODULE_VERSION ?? ''
  const stateKey = root
  const currentState = loaderStates.get(stateKey)
  const currentMtime = existsSync(tsconfigPath) ? statSync(tsconfigPath).mtimeMs : -1

  if (
    !currentState ||
    currentState.tsconfigPath !== tsconfigPath ||
    currentState.tsconfigMtimeMs !== currentMtime
  ) {
    const nextState = buildLoaderState(root, tsconfigPath, version)
    loaderStates.set(stateKey, nextState)
    return nextState
  }

  currentState.version = version

  return currentState
}

/**
 * Install Node.js module resolution hooks that resolve tsconfig path aliases and extensionless TypeScript files.
 *
 * Calling this function multiple times is safe — hooks are installed at most once.
 *
 * @see {@link loaderStates}
 */
export function installModuleHooks(): void {
  if (hooksInstalled) return

  registerHooks({
    resolve(specifier: string, context: any, nextResolve: any): any {
      const state = pickResolveState(specifier, context.parentURL, loaderStates)

      if (!state) return nextResolve(specifier, context)

      if (!isRelativeSpecifier(specifier) && !isAbsolute(specifier) && !hasUrlScheme(specifier)) {
        const mapped = resolveRuleSpecifier(specifier, state)

        if (mapped)
          return {
            shortCircuit: true,
            url: withVersion(pathToFileURL(mapped).href, state.version),
          }
      }

      const extensionless = resolveRelativeSpecifier(specifier, context.parentURL)

      if (extensionless)
        return {
          shortCircuit: true,
          url: withVersion(pathToFileURL(extensionless).href, state.version),
        }

      const resolved = nextResolve(specifier, context)

      if (!state.version || !resolved?.url?.startsWith('file://')) return resolved

      const resolvedPath = fileURLToPath(resolved.url)

      if (!isPathInsideRoot(resolvedPath, state.root)) return resolved

      return {
        ...resolved,
        url: withVersion(resolved.url, state.version),
      }
    },
  })

  hooksInstalled = true
}
