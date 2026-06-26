import type { ParsedLine } from './types'

/**
 * Create a parse error with a line-numbered message.
 *
 * @param {number} line - 1-indexed line number where the error occurred.
 * @param {string} reason - Human-readable reason for the failure.
 * @returns {Error} Error prefixed with `[parseYaml]` and the line number.
 */
export function createParseError(line: number, reason: string): Error {
  return Error(`[parseYaml] ${reason} at line ${line}`)
}

/**
 * Check whether a line starts with the YAML sequence marker `"-"`.
 *
 * @param {string} content - Trimmed line content (without leading indentation).
 * @returns `true` if the content starts with `"-"` followed by whitespace or end of string.
 */
export function isSequenceLine(content: string): boolean {
  return /^-(\s|$)/.test(content)
}

/**
 * Type guard that checks whether a value is a plain object (not an array).
 *
 * @param {unknown} value - Value to check.
 * @returns `true` if the value is a non-null, non-array object.
 */
export function isMappingValue(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value)
}

function findUnquotedIndex(
  content: string,
  predicate: (char: string, index: number) => boolean,
): number {
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

    if (predicate(char, i)) return i
  }

  return -1
}

/**
 * Strip inline comments from a YAML line.
 *
 * A `#` character is treated as a comment start only when preceded by
 * whitespace (or at the beginning of the content). Comments inside
 * quoted strings are preserved.
 *
 * @param {string} content - Line content (without leading indentation).
 * @returns {string} Content with the trailing inline comment removed and trimmed.
 */
export function stripInlineComment(content: string): string {
  const commentIndex = findUnquotedIndex(
    content,
    (char, index) => char === '#' && (index === 0 || /\s/.test(content[index - 1])),
  )

  return commentIndex === -1 ? content.trimEnd() : content.slice(0, commentIndex).trimEnd()
}

/**
 * Normalize raw YAML text into an array of parsed lines.
 *
 * Handles newline normalization, indentation validation (tabs are rejected),
 * inline comment stripping, and blank-line removal. Throws for unsupported
 * YAML constructs like multiple documents (`---`/`...`).
 *
 * @param {string} content - Raw YAML source text.
 * @returns {ParsedLine[]} Array of parsed lines with content, indent, and line number.
 * @throws {Error} If tabs are used for indentation or multiple documents are detected.
 */
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

/**
 * Find the index of the `":"` separator in a mapping key-value pair.
 *
 * Returns the position of the first `":"` that is followed by whitespace
 * or end of string, skipping `":"` characters inside quoted strings.
 *
 * @param {string} content - Line content to scan.
 * @returns Index of the separator `":"`, or `-1` if no valid separator is found.
 */
export function findMappingSeparator(content: string): number {
  return findUnquotedIndex(content, (char, index) => {
    if (char !== ':') return false

    const next = content[index + 1]
    return typeof next === 'undefined' || /\s/.test(next)
  })
}
