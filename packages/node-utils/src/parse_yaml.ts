type ParsedLine = {
  content: string
  indent: number
  line: number
}

type ParseResult = {
  value: unknown
  nextIndex: number
}

type ParseContext = {
  anchors: Map<string, unknown>
}

type ParsedValueToken =
  | {
      anchorName: string | undefined
      kind: 'nested'
    }
  | {
      anchorName: string | undefined
      kind: 'inline'
      raw: string
    }
  | {
      anchorName: string | undefined
      kind: 'alias'
      value: unknown
    }

function createParseError(line: number, reason: string): Error {
  return Error(`[parseYaml] ${reason} at line ${line}`)
}

function isSequenceLine(content: string): boolean {
  return /^-(\s|$)/.test(content)
}

function isMappingValue(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value)
}

function stripInlineComment(content: string): string {
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

function normalizeLines(content: string): ParsedLine[] {
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

function findMappingSeparator(content: string): number {
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

function parseDoubleQuotedScalar(value: string, line: number): string {
  let result = ''

  for (let i = 1; i < value.length; i++) {
    const char = value[i]

    if (char === '"') {
      if (i !== value.length - 1) throw createParseError(line, 'Invalid double quoted string')

      return result
    }

    if (char !== '\\') {
      result += char
      continue
    }

    const escaped = value[++i]

    if (typeof escaped === 'undefined') throw createParseError(line, 'Invalid escape sequence')

    switch (escaped) {
      case '"':
      case '\\':
      case '/':
        result += escaped
        break
      case 'b':
        result += '\b'
        break
      case 'f':
        result += '\f'
        break
      case 'n':
        result += '\n'
        break
      case 'r':
        result += '\r'
        break
      case 't':
        result += '\t'
        break
      case 'u': {
        const hex = value.slice(i + 1, i + 5)
        if (!/^[0-9a-fA-F]{4}$/.test(hex))
          throw createParseError(line, 'Invalid unicode escape sequence')

        result += String.fromCharCode(Number.parseInt(hex, 16))
        i += 4
        break
      }
      default:
        throw createParseError(line, `Unsupported escape sequence \\${escaped}`)
    }
  }

  throw createParseError(line, 'Unterminated double quoted string')
}

function parseSingleQuotedScalar(value: string, line: number): string {
  let result = ''

  for (let i = 1; i < value.length; i++) {
    const char = value[i]

    if (char === "'") {
      if (value[i + 1] === "'") {
        result += "'"
        i++
        continue
      }

      if (i !== value.length - 1) throw createParseError(line, 'Invalid single quoted string')

      return result
    }

    result += char
  }

  throw createParseError(line, 'Unterminated single quoted string')
}

function parseQuotedScalar(value: string, line: number): string {
  if (value.startsWith('"')) return parseDoubleQuotedScalar(value, line)

  if (value.startsWith("'")) return parseSingleQuotedScalar(value, line)

  throw createParseError(line, 'Invalid quoted string')
}

function parsePlainScalar(value: string): unknown {
  if (value === '~') return null

  const lower = value.toLowerCase()
  if (lower === 'null') return null
  if (lower === 'true') return true
  if (lower === 'false') return false

  if (/^[-+]?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][-+]?\d+)?$/.test(value)) return Number(value)

  return value
}

function parseInlineValue(value: string, line: number): unknown {
  if (value.startsWith('|') || value.startsWith('>'))
    throw createParseError(line, 'Block scalar is not supported')

  if (value.startsWith('!')) throw createParseError(line, 'YAML tags are not supported')

  if (value === '[]') return []

  if (value === '{}') return Object.create(null)

  if (value.startsWith('[') || value.startsWith('{'))
    throw createParseError(line, 'Flow collection is not supported')

  if (value.startsWith('"') || value.startsWith("'")) return parseQuotedScalar(value, line)

  return parsePlainScalar(value)
}

function parseKey(rawKey: string, line: number): string {
  if (!rawKey.length) throw createParseError(line, 'Missing mapping key')

  if (rawKey.startsWith('"') || rawKey.startsWith("'")) {
    const key = parseQuotedScalar(rawKey, line)
    return key
  }

  if (rawKey.startsWith('[') || rawKey.startsWith('{'))
    throw createParseError(line, 'Complex mapping key is not supported')

  return rawKey
}

function parseReferenceToken(
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

  if (!/^[^\s\[\]\{\},]+$/.test(name))
    throw createParseError(line, marker === '&' ? 'Invalid anchor name' : 'Invalid alias name')

  return {
    name,
    rest: value.slice(index).trimStart(),
  }
}

function setAnchor(context: ParseContext, anchorName: string | undefined, value: unknown): void {
  if (!anchorName) return

  context.anchors.set(anchorName, value)
}

function parseValueToken(token: string, line: number, context: ParseContext): ParsedValueToken {
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

function parseNode(
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

function parseMapping(
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

function parseSequence(
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

export function parseYaml(content: string): unknown {
  const lines = normalizeLines(content)

  if (!lines.length) return undefined

  const context: ParseContext = {
    anchors: new Map(),
  }
  const parsed = parseNode(lines, 0, lines[0].indent, context)

  if (parsed.nextIndex < lines.length)
    throw createParseError(lines[parsed.nextIndex].line, 'Unexpected trailing content')

  return parsed.value
}
