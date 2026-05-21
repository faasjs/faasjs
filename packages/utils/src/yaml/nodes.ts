import { setAnchor, parseValueToken } from './anchor'
import { parseInlineValue, parseKey } from './scalar'
import { createParseError, isMappingValue, isSequenceLine, findMappingSeparator } from './scanner'
import type { ParsedLine, ParseContext, ParseResult } from './types'

function applyMergeKey(target: Record<string, unknown>, source: unknown, line: number): void {
  if (Array.isArray(source)) {
    for (const value of source) applyMergeKey(target, value, line)
    return
  }

  if (!isMappingValue(source))
    throw createParseError(line, 'Merge key "<<" expects a mapping or sequence of mappings')

  for (const key in source) {
    if (Object.hasOwn(target, key)) continue

    target[key] = source[key]
  }
}

function parseNestedBlockOrNull(
  lines: ParsedLine[],
  index: number,
  parentIndent: number,
  context: ParseContext,
): ParseResult {
  const next = lines[index + 1]

  if (!next || next.indent <= parentIndent)
    return {
      value: null,
      nextIndex: index + 1,
    }

  return parseNode(lines, index + 1, next.indent, context)
}

function parseMappingEntry(
  lines: ParsedLine[],
  index: number,
  content: string,
  entryIndent: number,
  line: number,
  context: ParseContext,
): {
  key: string
  value: unknown
  nextIndex: number
} {
  const separator = findMappingSeparator(content)

  if (separator < 0) throw createParseError(line, 'Invalid mapping entry, expected "key: value"')

  const rawKey = content.slice(0, separator).trim()
  const key = parseKey(rawKey, line)
  const valueToken = content.slice(separator + 1).trimStart()

  if (!valueToken.length) {
    const nested = parseNestedBlockOrNull(lines, index, entryIndent, context)

    return {
      key,
      value: nested.value,
      nextIndex: nested.nextIndex,
    }
  }

  const token = parseValueToken(valueToken, line, context)

  if (token.kind === 'alias') {
    setAnchor(context, token.anchorName, token.value)

    return {
      key,
      value: token.value,
      nextIndex: index + 1,
    }
  }

  if (token.kind === 'nested') {
    const nested = parseNestedBlockOrNull(lines, index, entryIndent, context)
    setAnchor(context, token.anchorName, nested.value)

    return {
      key,
      value: nested.value,
      nextIndex: nested.nextIndex,
    }
  }

  const inlineValue = parseInlineValue(token.raw, line)
  setAnchor(context, token.anchorName, inlineValue)

  return {
    key,
    value: inlineValue,
    nextIndex: index + 1,
  }
}

export function parseMapping(
  lines: ParsedLine[],
  index: number,
  indent: number,
  context: ParseContext,
): ParseResult {
  const value: Record<string, unknown> = Object.create(null)
  let currentIndex = index

  while (currentIndex < lines.length) {
    const line = lines[currentIndex]

    if (line.indent < indent) break

    if (line.indent > indent)
      throw createParseError(
        line.line,
        `Unexpected indentation in mapping: expected ${indent} spaces but got ${line.indent}`,
      )

    if (isSequenceLine(line.content))
      throw createParseError(
        line.line,
        'Cannot mix sequence item with mapping at the same indentation',
      )

    const entry = parseMappingEntry(lines, currentIndex, line.content, indent, line.line, context)

    if (entry.key === '<<') applyMergeKey(value, entry.value, line.line)
    else value[entry.key] = entry.value

    currentIndex = entry.nextIndex
  }

  return {
    value,
    nextIndex: currentIndex,
  }
}

function parseSequenceItem(
  lines: ParsedLine[],
  index: number,
  indent: number,
  context: ParseContext,
): ParseResult {
  const line = lines[index]
  const rest = line.content.slice(1)

  if (rest.length && !/^\s/.test(rest))
    throw createParseError(line.line, 'Missing whitespace after sequence marker "-"')

  const token = rest.trimStart()

  if (!token.length) return parseNestedBlockOrNull(lines, index, indent, context)

  const parsedToken = parseValueToken(token, line.line, context)

  if (parsedToken.kind === 'alias') {
    setAnchor(context, parsedToken.anchorName, parsedToken.value)

    return {
      value: parsedToken.value,
      nextIndex: index + 1,
    }
  }

  if (parsedToken.kind === 'nested') {
    const nested = parseNestedBlockOrNull(lines, index, indent, context)
    setAnchor(context, parsedToken.anchorName, nested.value)

    return nested
  }

  if (findMappingSeparator(parsedToken.raw) < 0) {
    const inlineValue = parseInlineValue(parsedToken.raw, line.line)
    setAnchor(context, parsedToken.anchorName, inlineValue)

    return {
      value: inlineValue,
      nextIndex: index + 1,
    }
  }

  const itemIndent = indent + 2
  const item: Record<string, unknown> = Object.create(null)
  const firstEntry = parseMappingEntry(
    lines,
    index,
    parsedToken.raw,
    itemIndent,
    line.line,
    context,
  )

  if (firstEntry.key === '<<') applyMergeKey(item, firstEntry.value, line.line)
  else item[firstEntry.key] = firstEntry.value

  let currentIndex = firstEntry.nextIndex

  while (currentIndex < lines.length) {
    const next = lines[currentIndex]

    if (next.indent < itemIndent) break

    if (next.indent > itemIndent)
      throw createParseError(
        next.line,
        `Unexpected indentation in sequence mapping: expected ${itemIndent} spaces but got ${next.indent}`,
      )

    if (isSequenceLine(next.content))
      throw createParseError(
        next.line,
        'Cannot mix sequence item with mapping at the same indentation',
      )

    const entry = parseMappingEntry(
      lines,
      currentIndex,
      next.content,
      itemIndent,
      next.line,
      context,
    )

    if (entry.key === '<<') applyMergeKey(item, entry.value, next.line)
    else item[entry.key] = entry.value

    currentIndex = entry.nextIndex
  }

  setAnchor(context, parsedToken.anchorName, item)

  return {
    value: item,
    nextIndex: currentIndex,
  }
}

export function parseSequence(
  lines: ParsedLine[],
  index: number,
  indent: number,
  context: ParseContext,
): ParseResult {
  const value: unknown[] = []
  let currentIndex = index

  while (currentIndex < lines.length) {
    const line = lines[currentIndex]

    if (line.indent < indent) break

    if (line.indent > indent)
      throw createParseError(
        line.line,
        `Unexpected indentation in sequence: expected ${indent} spaces but got ${line.indent}`,
      )

    if (!isSequenceLine(line.content))
      throw createParseError(
        line.line,
        'Cannot mix mapping entry with sequence at the same indentation',
      )

    const item = parseSequenceItem(lines, currentIndex, indent, context)

    value.push(item.value)
    currentIndex = item.nextIndex
  }

  return {
    value,
    nextIndex: currentIndex,
  }
}

export function parseNode(
  lines: ParsedLine[],
  index: number,
  indent: number,
  context: ParseContext,
): ParseResult {
  const current = lines[index]

  if (!current) return { value: null, nextIndex: index }

  if (current.indent !== indent)
    throw createParseError(
      current.line,
      `Unexpected indentation: expected ${indent} spaces but got ${current.indent}`,
    )

  if (isSequenceLine(current.content)) return parseSequence(lines, index, indent, context)

  return parseMapping(lines, index, indent, context)
}
