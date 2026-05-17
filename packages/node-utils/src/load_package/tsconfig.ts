import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'

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

export function parseTsconfig(tsconfigPath: string): TsconfigData {
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
