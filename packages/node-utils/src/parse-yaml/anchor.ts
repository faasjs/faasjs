import { createParseError } from './scanner'
import type { ParseContext, ParsedValueToken } from './types'

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

export function setAnchor(
  context: ParseContext,
  anchorName: string | undefined,
  value: unknown,
): void {
  if (!anchorName) return

  context.anchors.set(anchorName, value)
}

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
