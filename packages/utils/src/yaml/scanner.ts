import type { ParsedLine } from './types'

export function createParseError(line: number, reason: string): Error {
  return Error(`[parseYaml] ${reason} at line ${line}`)
}

export function isSequenceLine(content: string): boolean {
  return /^-(\s|$)/.test(content)
}

export function isMappingValue(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value)
}

export function stripInlineComment(content: string): string {
  let inSingleQuote = false
  let inDoubleQuote = false
  let escaped = false

  for (let i = 0; i < content.length; i++) {
    const char = content[i]

    if (inDoubleQuote) {
      if (escaped) {
        escaped = false
        continue
      }

      if (char === '\\') {
        escaped = true
        continue
      }

      if (char === '"') inDoubleQuote = false

      continue
    }

    if (inSingleQuote) {
      if (char === "'") {
        if (content[i + 1] === "'") {
          i++
          continue
        }

        inSingleQuote = false
      }

      continue
    }

    if (char === '"') {
      inDoubleQuote = true
      continue
    }

    if (char === "'") {
      inSingleQuote = true
      continue
    }

    if (char === '#' && (i === 0 || /\s/.test(content[i - 1]))) return content.slice(0, i).trimEnd()
  }

  return content.trimEnd()
}

export function normalizeLines(content: string): ParsedLine[] {
  const lines = content.replace(/\r\n?/g, '\n').split('\n')
  const normalized: ParsedLine[] = []

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const lineNumber = i + 1
    const leading = line.match(/^[ \t]*/)?.[0] || ''

    if (leading.includes('\t'))
      throw createParseError(lineNumber, 'Tabs are not supported for indentation')

    const indent = leading.length
    const withoutIndent = line.slice(indent)
    const contentWithoutComment = stripInlineComment(withoutIndent)

    if (!contentWithoutComment.trim()) continue

    if (contentWithoutComment === '---' || contentWithoutComment === '...')
      throw createParseError(lineNumber, 'Multiple YAML documents are not supported')

    normalized.push({
      content: contentWithoutComment,
      indent,
      line: lineNumber,
    })
  }

  return normalized
}

export function findMappingSeparator(content: string): number {
  let inSingleQuote = false
  let inDoubleQuote = false
  let escaped = false

  for (let i = 0; i < content.length; i++) {
    const char = content[i]

    if (inDoubleQuote) {
      if (escaped) {
        escaped = false
        continue
      }

      if (char === '\\') {
        escaped = true
        continue
      }

      if (char === '"') inDoubleQuote = false

      continue
    }

    if (inSingleQuote) {
      if (char === "'") {
        if (content[i + 1] === "'") {
          i++
          continue
        }

        inSingleQuote = false
      }

      continue
    }

    if (char === '"') {
      inDoubleQuote = true
      continue
    }

    if (char === "'") {
      inSingleQuote = true
      continue
    }

    if (char !== ':') continue

    const next = content[i + 1]
    if (typeof next === 'undefined' || /\s/.test(next)) return i
  }

  return -1
}
