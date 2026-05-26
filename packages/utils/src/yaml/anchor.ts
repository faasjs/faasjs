import { createParseError } from './scanner'
import type { ParseContext, ParsedValueToken } from './types'

/**
 * Parse a YAML anchor name or alias name from a value token.
 *
 * @param {string} value - Token starting with `&` (anchor) or `*` (alias).
 * @param {number} line - 1-indexed line number for error reporting.
 * @param {'&' | '*'} marker - Which marker character the token starts with.
 * @returns Object with the anchor/alias `name` and remaining `rest` text.
 * @throws {Error} If the name is missing, empty, or contains invalid characters.
 *
 * @example
 * ```ts
 * parseReferenceToken('&myAnchor value', 1, '&')
 * // { name: 'myAnchor', rest: 'value' }
 * ```
 */
export function parseReferenceToken(
  value: string,
  line: number,
  marker: '&' | '*',
): {
  name: string
  rest: string
} {
  let index = 1
  while (index < value.length && !/\s/.test(value[index])) index++

  const name = value.slice(1, index)
  if (!name.length)
    throw createParseError(line, marker === '&' ? 'Missing anchor name' : 'Missing alias name')

  if (!/^[^\s[\]{},]+$/.test(name))
    throw createParseError(line, marker === '&' ? 'Invalid anchor name' : 'Invalid alias name')

  return {
    name,
    rest: value.slice(index).trimStart(),
  }
}

/**
 * Store a parsed value under an anchor name for later alias resolution.
 *
 * This is a no-op when `anchorName` is undefined.
 *
 * @param {ParseContext} context - Parse context with the anchors map.
 * @param {string | undefined} anchorName - Anchor name, or undefined if none.
 * @param {unknown} value - Value to store under the anchor name.
 */
export function setAnchor(
  context: ParseContext,
  anchorName: string | undefined,
  value: unknown,
): void {
  if (!anchorName) return

  context.anchors.set(anchorName, value)
}

/**
 * Parse a YAML value token, resolving anchors and aliases.
 *
 * Handles three token kinds:
 * - `"nested"`: Token is an anchor-only line (`&name`), value parsed from the next block.
 * - `"alias"`: Token starts with `*`, resolved from previously stored anchors.
 * - `"inline"`: Plain token to be parsed as an inline scalar value.
 *
 * @param {string} token - Value token from a mapping entry or sequence item.
 * @param {number} line - 1-indexed line number for error reporting.
 * @param {ParseContext} context - Parse context with the anchors map.
 * @returns {ParsedValueToken} Describes the token kind and optional anchor name/raw value.
 * @throws {Error} If an alias references an unknown anchor or has trailing content.
 */
export function parseValueToken(
  token: string,
  line: number,
  context: ParseContext,
): ParsedValueToken {
  let anchorName: string | undefined
  let rest = token

  if (rest.startsWith('&')) {
    const anchor = parseReferenceToken(rest, line, '&')
    anchorName = anchor.name
    rest = anchor.rest

    if (!rest.length)
      return {
        anchorName,
        kind: 'nested',
      }
  }

  if (rest.startsWith('*')) {
    const alias = parseReferenceToken(rest, line, '*')

    if (alias.rest.length) throw createParseError(line, 'Unexpected token after alias')

    if (!context.anchors.has(alias.name))
      throw createParseError(line, `Unknown alias "*${alias.name}"`)

    return {
      anchorName,
      kind: 'alias',
      value: context.anchors.get(alias.name),
    }
  }

  return {
    anchorName,
    kind: 'inline',
    raw: rest,
  }
}
