import { existsSync, readFileSync, realpathSync, statSync } from 'node:fs'
import { registerHooks } from 'node:module'
import { dirname, extname, isAbsolute, join, resolve, sep } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

export type NodeRuntime = 'commonjs' | 'module'

export type LoadPackageOptions = {
  /** Project root used to scope tsconfig paths resolving. */
  root?: string
  /** Explicit tsconfig path, defaults to `<root>/tsconfig.json`. */
  tsconfigPath?: string
  /** Optional version token used to bust ESM module cache. */
  version?: string
}

type TsconfigPathRule = {
  key: string
  targets: string[]
  hasWildcard: boolean
  prefix: string
  suffix: string
}

type TsconfigData = {
  baseUrl: string
  rules: TsconfigPathRule[]
}

type LoaderState = {
  root: string
  tsconfigPath: string
  tsconfigMtimeMs: number
  baseUrl: string
  rules: TsconfigPathRule[]
  version: string
}

const VERSION_QUERY_KEY = 'faasjsv'
const SCRIPT_EXTENSIONS = ['.ts', '.tsx', '.mts', '.cts', '.js', '.jsx', '.mjs', '.cjs', '.json']

const loaderStates = new Map<string, LoaderState>()

let _runtime: NodeRuntime | null = null
let hooksInstalled = false

export function resetRuntime(): void {
  _runtime = null
  loaderStates.clear()
}

function isRelativeSpecifier(specifier: string): boolean {
  return specifier === '.' || specifier === '..' || specifier.startsWith('./') || specifier.startsWith('../')
}

function hasUrlScheme(specifier: string): boolean {
  return /^[a-zA-Z][a-zA-Z\d+.-]*:/.test(specifier)
}

function toFilePath(value: string): string | undefined {
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

function normalizeFileSystemPath(path: string): string {
  const resolvedPath = resolve(path)

  try {
    return realpathSync.native(resolvedPath)
  } catch {
    return resolvedPath
  }
}

function normalizeRoot(root: string): string {
  const normalized = normalizeFileSystemPath(root)

  if (normalized === sep) return normalized

  return normalized.endsWith(sep) ? normalized.slice(0, -1) : normalized
}

function isPathInsideRoot(filePath: string, root: string): boolean {
  const normalizedFilePath = normalizeFileSystemPath(filePath)
  return normalizedFilePath === root || normalizedFilePath.startsWith(`${root}${sep}`)
}

function getPathType(path: string): 'file' | 'directory' | undefined {
  try {
    const stat = statSync(path)

    if (stat.isFile()) return 'file'
    if (stat.isDirectory()) return 'directory'
  } catch {}

  return undefined
}

function resolveScriptFile(candidate: string): string | undefined {
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

function parseJSONWithComments(content: string): any {
  let stripped = ''
  let inString = false
  let escaped = false
  let inSingleLineComment = false
  let inMultiLineComment = false

  for (let i = 0; i < content.length; i++) {
    const current = content[i]
    const next = content[i + 1]

    if (inSingleLineComment) {
      if (current === '\n') {
        inSingleLineComment = false
        stripped += current
      }

      continue
    }

    if (inMultiLineComment) {
      if (current === '*' && next === '/') {
        inMultiLineComment = false
        i++
      }

      continue
    }

    if (inString) {
      stripped += current

      if (escaped) {
        escaped = false
        continue
      }

      if (current === '\\') {
        escaped = true
        continue
      }

      if (current === '"') inString = false

      continue
    }

    if (current === '"') {
      inString = true
      stripped += current
      continue
    }

    if (current === '/' && next === '/') {
      inSingleLineComment = true
      i++
      continue
    }

    if (current === '/' && next === '*') {
      inMultiLineComment = true
      i++
      continue
    }

    stripped += current
  }

  let normalized = ''
  inString = false
  escaped = false

  for (let i = 0; i < stripped.length; i++) {
    const current = stripped[i]

    if (inString) {
      normalized += current

      if (escaped) {
        escaped = false
        continue
      }

      if (current === '\\') {
        escaped = true
        continue
      }

      if (current === '"') inString = false

      continue
    }

    if (current === '"') {
      inString = true
      normalized += current
      continue
    }

    if (current === ',') {
      let cursor = i + 1

      while (cursor < stripped.length && /\s/.test(stripped[cursor])) cursor++

      if (stripped[cursor] === '}' || stripped[cursor] === ']') continue
    }

    normalized += current
  }

  return JSON.parse(normalized)
}

function parseTsconfig(tsconfigPath: string): TsconfigData {
  const tsconfigDir = dirname(tsconfigPath)
  const parsed = parseJSONWithComments(readFileSync(tsconfigPath, 'utf8')) as Record<string, any>

  const compilerOptions =
    parsed && typeof parsed.compilerOptions === 'object'
      ? (parsed.compilerOptions as Record<string, any>)
      : Object.create(null)

  const baseUrl =
    typeof compilerOptions.baseUrl === 'string' && compilerOptions.baseUrl.length
      ? resolve(tsconfigDir, compilerOptions.baseUrl)
      : tsconfigDir

  const paths =
    compilerOptions.paths && typeof compilerOptions.paths === 'object'
      ? (compilerOptions.paths as Record<string, unknown>)
      : Object.create(null)

  const rules: TsconfigPathRule[] = []

  for (const key in paths) {
    const rawTargets = paths[key]

    if (!Array.isArray(rawTargets)) continue

    const targets = rawTargets
      .filter((item): item is string => typeof item === 'string' && item.length > 0)
      .map((item) => item.trim())

    if (!targets.length) continue

    const wildcardIndex = key.indexOf('*')

    if (wildcardIndex === -1) {
      rules.push({
        key,
        targets,
        hasWildcard: false,
        prefix: key,
        suffix: '',
      })
      continue
    }

    if (key.lastIndexOf('*') !== wildcardIndex) continue

    rules.push({
      key,
      targets,
      hasWildcard: true,
      prefix: key.slice(0, wildcardIndex),
      suffix: key.slice(wildcardIndex + 1),
    })
  }

  rules.sort((a, b) => b.key.length - a.key.length)

  return {
    baseUrl,
    rules,
  }
}

function findNearestTsconfig(startPath: string): string | undefined {
  let current = resolve(startPath)

  while (true) {
    const tsconfigPath = join(current, 'tsconfig.json')

    if (existsSync(tsconfigPath)) return tsconfigPath

    const parent = dirname(current)

    if (parent === current) return undefined

    current = parent
  }
}

function resolveRuleSpecifier(specifier: string, state: LoaderState): string | undefined {
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

function resolveRelativeSpecifier(specifier: string, parentURL?: string): string | undefined {
  if (hasUrlScheme(specifier) && !specifier.startsWith('file://')) return undefined

  if (isAbsolute(specifier)) {
    if (extname(specifier)) return undefined

    return resolveScriptFile(specifier)
  }

  if (!isRelativeSpecifier(specifier) || !parentURL || !parentURL.startsWith('file://')) return undefined

  if (extname(specifier)) return undefined

  const parentPath = fileURLToPath(parentURL)

  return resolveScriptFile(resolve(dirname(parentPath), specifier))
}

function withVersion(url: string, version: string): string {
  if (!version || !url.startsWith('file://')) return url

  const parsed = new URL(url)
  parsed.searchParams.set(VERSION_QUERY_KEY, version)

  return parsed.toString()
}

function pickStateByFilePath(filePath: string): LoaderState | undefined {
  let matched: LoaderState | undefined

  for (const state of loaderStates.values()) {
    if (!isPathInsideRoot(filePath, state.root)) continue

    if (!matched || state.root.length > matched.root.length) matched = state
  }

  return matched
}

function pickResolveState(specifier: string, parentURL?: string): LoaderState | undefined {
  if (parentURL?.startsWith('file://')) {
    const parentPath = fileURLToPath(parentURL)
    const parentState = pickStateByFilePath(parentPath)

    if (parentState) return parentState
  }

  const filePath = toFilePath(specifier)

  if (filePath) return pickStateByFilePath(filePath)

  return undefined
}

function buildLoaderState(root: string, tsconfigPath: string, version: string): LoaderState {
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

function ensureLoaderState(name: string, options: LoadPackageOptions): LoaderState | undefined {
  let root = options.root ? normalizeRoot(options.root) : ''
  let tsconfigPath = options.tsconfigPath ? normalizeFileSystemPath(options.tsconfigPath) : ''

  if (!root && tsconfigPath) root = normalizeRoot(dirname(tsconfigPath))

  if (!root) {
    const filePath = toFilePath(name)

    if (filePath) {
      const nearestTsconfig = findNearestTsconfig(dirname(filePath))

      if (nearestTsconfig) {
        tsconfigPath = nearestTsconfig
        root = normalizeRoot(dirname(nearestTsconfig))
      }
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

function installModuleHooks(): void {
  if (hooksInstalled) return

  registerHooks({
    resolve(specifier: string, context: any, nextResolve: any): any {
      const state = pickResolveState(specifier, context.parentURL)

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

/**
 * Detect current JavaScript runtime environment.
 *
 * This function checks for presence of `require` first, then falls back to
 * Node.js ESM detection via `process.versions.node`.
 *
 * @returns {NodeRuntime} Returns `module` for ESM and `commonjs` for CJS.
 * @throws {Error} Throws an error if runtime cannot be determined.
 */
export function detectNodeRuntime(): NodeRuntime {
  if (_runtime) return _runtime

  if (typeof globalThis.require === 'function' && typeof module !== 'undefined')
    return (_runtime = 'commonjs')

  if (typeof process !== 'undefined' && process.versions?.node) return (_runtime = 'module')

  throw Error('Unknown runtime')
}

/**
 * Asynchronously loads a package by its name, supporting both ESM and CJS.
 *
 * @template T The type of module to be loaded.
 * @param name The package name to load.
 * @param defaultNames Preferred export keys used to resolve default values.
 * @param options Optional runtime loader options.
 * @returns Loaded module or resolved default export.
 */
export async function loadPackage<T = unknown>(
  name: string,
  defaultNames: string | string[] = 'default',
  options: LoadPackageOptions = {},
): Promise<T> {
  const runtime = detectNodeRuntime()

  let module: any

  if (runtime === 'module') {
    if (ensureLoaderState(name, options)) installModuleHooks()

    module = await import(name)
  } else if (runtime === 'commonjs') module = globalThis.require(name)
  else throw Error('Unknown runtime')

  if (typeof defaultNames === 'string')
    return defaultNames in module ? module[defaultNames] : module

  for (const key of defaultNames) if (key in module) return module[key]

  return module
}
