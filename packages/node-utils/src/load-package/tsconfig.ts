import { existsSync, readFileSync, realpathSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, isAbsolute, resolve } from 'node:path'

import type { TsconfigData, TsconfigPathRule } from './types'

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

type ParsedCompilerOptions = {
  baseUrl?: string
  paths?: {
    sourceDir: string
    value: Record<string, unknown>
  }
}

function canonicalConfigPath(path: string): string {
  const absolutePath = resolve(path)

  try {
    return realpathSync.native(absolutePath)
  } catch {
    return absolutePath
  }
}

function resolveRelativeConfigPath(specifier: string, configDir: string): string {
  const candidate = isAbsolute(specifier) ? specifier : resolve(configDir, specifier)

  if (existsSync(candidate)) return resolve(candidate)
  if (!candidate.endsWith('.json') && existsSync(`${candidate}.json`))
    return resolve(`${candidate}.json`)

  throw new Error(`Cannot resolve tsconfig extends "${specifier}" from "${configDir}"`)
}

function resolvePackageConfigPath(specifier: string, configPath: string): string {
  const require = createRequire(configPath)
  const candidates = [specifier]

  if (!specifier.endsWith('.json')) {
    candidates.push(`${specifier}.json`)
    candidates.push(`${specifier}/tsconfig.json`)
  }

  for (const candidate of candidates)
    try {
      return resolve(require.resolve(candidate))
    } catch {}

  throw new Error(`Cannot resolve tsconfig extends "${specifier}" from "${dirname(configPath)}"`)
}

function resolveExtendedConfigPath(specifier: string, configPath: string): string {
  if (isAbsolute(specifier) || specifier.startsWith('./') || specifier.startsWith('../'))
    return resolveRelativeConfigPath(specifier, dirname(configPath))

  return resolvePackageConfigPath(specifier, configPath)
}

function parseCompilerOptions(
  configPath: string,
  stack: string[],
  cache: Map<string, ParsedCompilerOptions>,
): ParsedCompilerOptions {
  const absolutePath = resolve(configPath)
  const canonicalPath = canonicalConfigPath(absolutePath)
  const cycleIndex = stack.indexOf(canonicalPath)

  if (cycleIndex !== -1) {
    const cycle = stack.slice(cycleIndex).concat(canonicalPath)
    throw new Error(`Circular tsconfig extends: ${cycle.join(' -> ')}`)
  }

  const cached = cache.get(canonicalPath)
  if (cached) return cached

  const configDir = dirname(absolutePath)
  const parsed = parseJSONWithComments(readFileSync(absolutePath, 'utf8')) as Record<string, any>
  const nextStack = stack.concat(canonicalPath)
  const extendedConfigs = Array.isArray(parsed?.extends) ? parsed.extends : [parsed?.extends]
  let merged: ParsedCompilerOptions = {}

  for (const specifier of extendedConfigs) {
    if (typeof specifier !== 'string' || !specifier.length) continue

    const extendedPath = resolveExtendedConfigPath(specifier, absolutePath)
    merged = {
      ...merged,
      ...parseCompilerOptions(extendedPath, nextStack, cache),
    }
  }

  const compilerOptions =
    parsed && typeof parsed.compilerOptions === 'object' && !Array.isArray(parsed.compilerOptions)
      ? (parsed.compilerOptions as Record<string, any>)
      : undefined

  if (compilerOptions) {
    if (typeof compilerOptions.baseUrl === 'string')
      merged.baseUrl = resolve(configDir, compilerOptions.baseUrl)

    if (
      compilerOptions.paths &&
      typeof compilerOptions.paths === 'object' &&
      !Array.isArray(compilerOptions.paths)
    )
      merged.paths = {
        sourceDir: configDir,
        value: compilerOptions.paths as Record<string, unknown>,
      }
  }

  cache.set(canonicalPath, merged)

  return merged
}

/**
 * Parse a `tsconfig.json` file into path-alias resolution data.
 *
 * Strips JSON comments, follows relative or package-based `extends` chains,
 * resolves inherited `baseUrl` and `paths` from their effective source,
 * and sorts path rules so longer prefixes are attempted first during resolution.
 *
 * @param {string} tsconfigPath - Absolute path to the `tsconfig.json` file.
 * @returns {TsconfigData} Parsed base URL and ordered path-alias rules.
 *
 * @example
 * ```ts
 * import { parseTsconfig } from '@faasjs/node-utils'
 *
 * const data = parseTsconfig('/project/tsconfig.json')
 * console.log(data.baseUrl, data.rules.length)
 * ```
 */
export function parseTsconfig(tsconfigPath: string): TsconfigData {
  const absolutePath = resolve(tsconfigPath)
  const compilerOptions = parseCompilerOptions(absolutePath, [], new Map())
  const baseUrl =
    compilerOptions.baseUrl || compilerOptions.paths?.sourceDir || dirname(absolutePath)
  const paths = compilerOptions.paths?.value || Object.create(null)

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
