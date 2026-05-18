import { statSync, realpathSync } from 'node:fs'
import { dirname, extname, isAbsolute, join, resolve, sep } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

import { isPathInsideRoot } from '../isPathInsideRoot/index.ts'
import type { LoaderState } from './types'
import { VERSION_QUERY_KEY, SCRIPT_EXTENSIONS } from './types'

export function isRelativeSpecifier(specifier: string): boolean {
  return (
    specifier === '.' ||
    specifier === '..' ||
    specifier.startsWith('./') ||
    specifier.startsWith('../')
  )
}

export function hasUrlScheme(specifier: string): boolean {
  return /^[a-zA-Z][a-zA-Z\d+.-]*:/.test(specifier)
}

export function toFilePath(value: string): string | undefined {
  if (value.startsWith('file://')) {
    try {
      return normalizeFileSystemPath(fileURLToPath(value))
    } catch {
      return undefined
    }
  }

  if (isAbsolute(value)) return normalizeFileSystemPath(value)

  return undefined
}

export function normalizeFileSystemPath(path: string): string {
  const resolvedPath = resolve(path)

  try {
    return realpathSync.native(resolvedPath)
  } catch {
    return resolvedPath
  }
}

export function normalizeRoot(root: string): string {
  const normalized = normalizeFileSystemPath(root)

  if (normalized === sep) return normalized

  return normalized.endsWith(sep) ? normalized.slice(0, -1) : normalized
}

export function resolveLoaderEntryPath(entry: string | undefined): string | undefined {
  if (!entry) return undefined

  const normalizedEntry = entry.trim()
  if (!normalizedEntry) return undefined

  if (normalizedEntry.startsWith('file://')) {
    try {
      return normalizeFileSystemPath(fileURLToPath(normalizedEntry))
    } catch {
      return undefined
    }
  }

  const absoluteEntry = isAbsolute(normalizedEntry)
    ? normalizedEntry
    : resolve(process.cwd(), normalizedEntry)

  return normalizeFileSystemPath(absoluteEntry)
}

export function getPathType(path: string): 'file' | 'directory' | undefined {
  try {
    const stat = statSync(path)

    if (stat.isFile()) return 'file'
    if (stat.isDirectory()) return 'directory'
  } catch {}

  return undefined
}

export function resolveScriptFile(candidate: string): string | undefined {
  const resolved = resolve(candidate)
  const directType = getPathType(resolved)

  if (directType === 'file') return resolved

  if (!extname(resolved)) {
    for (const extension of SCRIPT_EXTENSIONS) {
      const filePath = `${resolved}${extension}`

      if (getPathType(filePath) === 'file') return filePath
    }
  }

  if (directType === 'directory') {
    for (const extension of SCRIPT_EXTENSIONS) {
      const indexPath = join(resolved, `index${extension}`)

      if (getPathType(indexPath) === 'file') return indexPath
    }
  }

  return undefined
}

export function resolveLoadPackageSpecifier(name: string): string {
  if (hasUrlScheme(name)) return name
  if (!isAbsolute(name) && !isRelativeSpecifier(name)) return name

  const absolutePath = isAbsolute(name) ? name : resolve(process.cwd(), name)
  const scriptFile = resolveScriptFile(absolutePath) || resolve(absolutePath)

  return pathToFileURL(scriptFile).href
}

export function resolveRuleSpecifier(specifier: string, state: LoaderState): string | undefined {
  if (!state.rules.length) return undefined

  for (const rule of state.rules) {
    let wildcardValue = ''

    if (rule.hasWildcard) {
      if (!specifier.startsWith(rule.prefix)) continue
      if (!specifier.endsWith(rule.suffix)) continue

      wildcardValue = specifier.slice(rule.prefix.length, specifier.length - rule.suffix.length)
    } else {
      if (specifier !== rule.prefix) continue
    }

    for (const target of rule.targets) {
      const replaced = rule.hasWildcard ? target.replace('*', wildcardValue) : target
      const resolved = resolveScriptFile(resolve(state.baseUrl, replaced))

      if (resolved) return resolved
    }
  }

  return undefined
}

export function resolveRelativeSpecifier(
  specifier: string,
  parentURL?: string,
): string | undefined {
  if (hasUrlScheme(specifier) && !specifier.startsWith('file://')) return undefined

  if (isAbsolute(specifier)) return resolveScriptFile(specifier)

  if (!isRelativeSpecifier(specifier) || !parentURL || !parentURL.startsWith('file://'))
    return undefined

  const parentPath = fileURLToPath(parentURL)

  return resolveScriptFile(resolve(dirname(parentPath), specifier))
}

export function withVersion(url: string, version: string): string {
  if (!version || !url.startsWith('file://')) return url

  const parsed = new URL(url)
  parsed.searchParams.set(VERSION_QUERY_KEY, version)

  return parsed.toString()
}

export function pickStateByFilePath(
  filePath: string,
  loaderStates: Map<string, LoaderState>,
): LoaderState | undefined {
  let matched: LoaderState | undefined

  for (const state of loaderStates.values()) {
    if (!isPathInsideRoot(filePath, state.root)) continue

    if (!matched || state.root.length > matched.root.length) matched = state
  }

  return matched
}

export function pickResolveState(
  specifier: string,
  parentURL: string | undefined,
  loaderStates: Map<string, LoaderState>,
): LoaderState | undefined {
  if (parentURL?.startsWith('file://')) {
    const parentPath = fileURLToPath(parentURL)
    const parentState = pickStateByFilePath(parentPath, loaderStates)

    if (parentState) return parentState
  }

  const filePath = toFilePath(specifier)

  if (filePath) return pickStateByFilePath(filePath, loaderStates)

  return undefined
}
