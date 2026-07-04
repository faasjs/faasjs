import type { ZodOutput, ZodType } from '../zod'
import { parseNode } from './nodes'
import { createParseError, normalizeLines, normalizeSourceLines } from './scanner'
import type { ParseContext } from './types'

export type { ParsedLine, ParseResult, ParseContext, ParsedValueToken, SourceLine } from './types'

export {
  createParseError,
  isSequenceLine,
  isMappingValue,
  stripInlineComment,
  normalizeLines,
  normalizeSourceLines,
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
 * Supports the YAML subset used by `faas.yaml`: mappings, sequences, plain and quoted
 * scalars, literal and folded block scalars, inline comments, anchors, aliases,
 * booleans, numbers, nulls, arrays, and objects. Unsupported syntax throws an
 * `Error` whose message is prefixed with `[parseYaml]`.
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
export function parseYaml<T = unknown>(content: string): T
/**
 * Parses the FaasJS-supported YAML subset and validates it with a Zod schema.
 *
 * Empty YAML content is parsed as `undefined` and then validated by the schema.
 *
 * @param {string} content - YAML source text.
 * @param schema - Zod schema used to validate the parsed value.
 * @returns The Zod schema output.
 * @throws {Error} If the YAML uses unsupported syntax or cannot be parsed.
 * @throws {ZodError} If schema validation fails.
 */
export function parseYaml<Schema extends ZodType>(
  content: string,
  schema: Schema,
): ZodOutput<Schema>
export function parseYaml(content: string, schema?: ZodType): unknown {
  const sourceLines = normalizeSourceLines(content)
  const lines = normalizeLines(content)

  if (!lines.length) return schema ? schema.parse(undefined) : undefined

  const context: ParseContext = {
    anchors: new Map(),
    sourceLines,
  }
  const parsed = parseNode(lines, 0, lines[0].indent, context)

  if (parsed.nextIndex < lines.length)
    throw createParseError(lines[parsed.nextIndex].line, 'Unexpected trailing content')

  return schema ? schema.parse(parsed.value) : parsed.value
}
