import { parseNode } from './nodes'
import { createParseError, normalizeLines } from './scanner'
import type { ParseContext } from './types'

export type { ParsedLine, ParseResult, ParseContext, ParsedValueToken } from './types'

export {
  createParseError,
  isSequenceLine,
  isMappingValue,
  stripInlineComment,
  normalizeLines,
  findMappingSeparator,
} from './scanner'

export {
  parseDoubleQuotedScalar,
  parseSingleQuotedScalar,
  parseQuotedScalar,
  parsePlainScalar,
  parseInlineValue,
  parseKey,
} from './scalar'

export { parseReferenceToken, setAnchor, parseValueToken } from './anchor'

export { parseNode, parseMapping, parseSequence } from './nodes'

/**
 * Parse the FaasJS-supported YAML subset into JavaScript values.
 *
 * Prefer `loadConfig()` from `@faasjs/node-utils` when you want FaasJS to resolve
 * layered config files for a function.
 *
 * @param {string} content - YAML source text.
 * @returns Parsed value, or `undefined` when the input only contains blank lines or comments.
 * @throws {Error} If the YAML uses unsupported syntax or cannot be parsed.
 *
 * @example
 * ```ts
 * import { parseYaml } from '@faasjs/utils'
 *
 * const value = parseYaml(`defaults:
 *   plugins:
 *     http:
 *       type: http
 *       config:
 *         cookie:
 *           session:
 *             secret: replace-me
 * `)
 * ```
 */
export function parseYaml<T = unknown>(content: string): T {
  const lines = normalizeLines(content)

  if (!lines.length) return undefined as T

  const context: ParseContext = {
    anchors: new Map(),
  }
  const parsed = parseNode(lines, 0, lines[0].indent, context)

  if (parsed.nextIndex < lines.length)
    throw createParseError(lines[parsed.nextIndex].line, 'Unexpected trailing content')

  return parsed.value as T
}
