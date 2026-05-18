import { existsSync, statSync } from 'node:fs'
import { registerHooks } from 'node:module'
import { dirname, isAbsolute, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

import { isPathInsideRoot } from '../isPathInsideRoot/index.ts'
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

export const loaderStates = new Map<string, LoaderState>()
export let hooksInstalled = false

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
