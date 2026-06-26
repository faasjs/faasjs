import { statSync, realpathSync } from 'node:fs'
import { dirname, extname, isAbsolute, join, resolve, sep } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

import { isPathInsideRoot } from '../is-path-inside-root/index.ts'
import type { LoaderState } from './types'
import { VERSION_QUERY_KEY, SCRIPT_EXTENSIONS } from './types'

/**
 * Check whether a module specifier is relative (starts with `./` or `../`, or equals `.` or `..`).
 *
 * @param {string} specifier - Module specifier to test.
 * @returns {boolean} `true` when the specifier is relative.
 */
export function isRelativeSpecifier(specifier: string): boolean {
  return (
    specifier === '.' ||
    specifier === '..' ||
    specifier.startsWith('./') ||
    specifier.startsWith('../')
  )
}

/**
 * Check whether a string contains a URL scheme (e.g., `file://`, `npm:`).
 *
 * @param {string} specifier - Module specifier to test.
 * @returns {boolean} `true` when the specifier begins with a scheme.
 */
export function hasUrlScheme(specifier: string): boolean {
  return /^[a-zA-Z][a-zA-Z\d+.-]*:/.test(specifier)
}

/**
 * Strip the `npm:` prefix used by some runtimes before resolving a plugin type.
 *
 * @param {string} specifier - Plugin type specifier to normalize.
 * @returns {string} Specifier without a leading `npm:` prefix.
 */
export function stripNpmPrefix(specifier: string): string {
  return specifier.startsWith('npm:') ? specifier.slice(4) : specifier
}

/**
 * Normalize a plugin type specifier from a known base directory.
 *
 * Relative `file://./...`, `file://../...`, `./...`, and `../...` values become
 * file URLs from `baseDir`. Absolute paths are converted only for callers that
 * opt in, preserving `loadConfig()` output for absolute YAML values.
 *
 * @param {string} pluginType - Plugin type specifier to normalize.
 * @param {string} baseDir - Directory used to resolve relative specifiers.
 * @param {{ resolveAbsolute?: boolean }} [options] - Optional absolute-path behavior.
 * @returns {string} Normalized plugin type specifier.
 */
export function normalizePluginTypeSpecifier(
  pluginType: string,
  baseDir: string,
  options: { resolveAbsolute?: boolean } = {},
): string {
  const normalizedType = stripNpmPrefix(pluginType)

  if (normalizedType.startsWith('file://./') || normalizedType.startsWith('file://../'))
    return pathToFileURL(resolve(baseDir, normalizedType.slice('file://'.length))).href

  if (normalizedType.startsWith('./') || normalizedType.startsWith('../'))
    return pathToFileURL(resolve(baseDir, normalizedType)).href

  if (options.resolveAbsolute && isAbsolute(normalizedType))
    return pathToFileURL(resolve(normalizedType)).href

  return normalizedType
}

/**
 * Convert a `file://` URL or absolute path to a normalised filesystem path.
 *
 * @param {string} value - File URL or absolute path to convert.
 * @returns {string | undefined} Resolved filesystem path, or `undefined` if the URL could not be converted.
 */
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

/**
 * Resolve a filesystem path to its absolute, real (symlink-free) form.
 *
 * When the path does not exist on disk, the resolved absolute path is returned instead.
 *
 * @param {string} path - Filesystem path to normalise.
 * @returns {string} Resolved real path or absolute path.
 */
export function normalizeFileSystemPath(path: string): string {
  const resolvedPath = resolve(path)

  try {
    return realpathSync.native(resolvedPath)
  } catch {
    return resolvedPath
  }
}

/**
 * Normalise a project root path, stripping the trailing separator unless the root is the filesystem root (`/`).
 *
 * @param {string} root - Root path to normalise.
 * @returns {string} Normalised root path.
 */
export function normalizeRoot(root: string): string {
  const normalized = normalizeFileSystemPath(root)

  if (normalized === sep) return normalized

  return normalized.endsWith(sep) ? normalized.slice(0, -1) : normalized
}

/**
 * Resolve a user-supplied entry path to a normalised filesystem path.
 *
 * Handles file URLs, absolute paths, and relative paths (resolved against `process.cwd()`).
 *
 * @param {string | undefined} entry - Entry path to resolve.
 * @returns {string | undefined} Normalised filesystem path, or `undefined` when the argument is empty or could not be resolved.
 */
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

/**
 * Stat a path and return whether it is a file or directory.
 *
 * @param {string} path - Path to inspect.
 * @returns {'file' | 'directory' | undefined} `file` for regular files, `directory` for directories, `undefined` when the path does not exist.
 */
export function getPathType(path: string): 'file' | 'directory' | undefined {
  try {
    const stat = statSync(path)

    if (stat.isFile()) return 'file'
    if (stat.isDirectory()) return 'directory'
  } catch {}

  return undefined
}

/**
 * Resolve a bare specifier path to an actual script file by probing known extensions.
 *
 * If the candidate is already a file it is returned directly. Otherwise extensions from
 * {@link SCRIPT_EXTENSIONS} are tried, and directories are probed for `index` entries.
 *
 * @param {string} candidate - Path candidate to resolve.
 * @returns {string | undefined} Resolved script file path, or `undefined` if no file was found.
 */
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

/**
 * Convert a package specifier or file path into a `file://` URL suitable for dynamic `import()`.
 *
 * Bare specifiers (npm packages) and URL-scheme specifiers are returned unchanged.
 *
 * @param {string} name - Package name or file path.
 * @returns {string} File URL or original specifier.
 */
export function resolveLoadPackageSpecifier(name: string): string {
  if (hasUrlScheme(name)) return name
  if (!isAbsolute(name) && !isRelativeSpecifier(name)) return name

  const absolutePath = isAbsolute(name) ? name : resolve(process.cwd(), name)
  const scriptFile = resolveScriptFile(absolutePath) || resolve(absolutePath)

  return pathToFileURL(scriptFile).href
}

/**
 * Try to resolve a specifier against the tsconfig path-alias rules of a loader state.
 *
 * @param {string} specifier - Module specifier to resolve.
 * @param {LoaderState} state - Loader state containing tsconfig path rules.
 * @returns {string | undefined} Resolved filesystem path, or `undefined` if no rule matched.
 */
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

/**
 * Resolve a relative specifier against a parent URL to a concrete script file.
 *
 * Only file-relative imports (starting with `./` or `../`) whose parent is a `file://` URL are resolved.
 *
 * @param {string} specifier - Relative specifier to resolve.
 * @param {string} [parentURL] - Parent module URL used as the base for resolution.
 * @returns {string | undefined} Resolved script file path, or `undefined` when resolution is not applicable.
 */
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

/**
 * Append a version query parameter to a file URL so Node's import cache is invalidated.
 *
 * Non-`file://` URLs and empty version strings result in the original URL being returned unchanged.
 *
 * @param {string} url - File URL to annotate.
 * @param {string} version - Version token to append as a query parameter.
 * @returns {string} Versioned URL or the original URL when versioning is not applicable.
 */
export function withVersion(url: string, version: string): string {
  if (!version || !url.startsWith('file://')) return url

  const parsed = new URL(url)
  parsed.searchParams.set(VERSION_QUERY_KEY, version)

  return parsed.toString()
}

/**
 * Find the deepest loader state whose root contains the given filesystem path.
 *
 * @param {string} filePath - Filesystem path to check.
 * @param {Map<string, LoaderState>} loaderStates - Map of registered loader states keyed by root.
 * @returns {LoaderState | undefined} Matching loader state, or `undefined` if no state's root contains the path.
 */
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

/**
 * Pick the loader state applicable to a resolve request, preferring the parent module's state.
 *
 * When a parent URL is provided, its filesystem path is used first. Falls back to checking
 * the specifier's own path against registered states.
 *
 * @param {string} specifier - Module specifier being resolved.
 * @param {string | undefined} parentURL - URL of the importing module.
 * @param {Map<string, LoaderState>} loaderStates - Map of registered loader states keyed by root.
 * @returns {LoaderState | undefined} Matching loader state, or `undefined` if none applies.
 */
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
