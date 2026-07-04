import { createParseError } from './scanner'
import type { ParsedLine, ParseContext, ParseResult } from './types'

type BlockScalarStyle = 'folded' | 'literal'
type BlockScalarChomp = 'clip' | 'keep' | 'strip'

type BlockScalarHeader = {
  chomp: BlockScalarChomp
  indent: number | undefined
  style: BlockScalarStyle
}

type BlockScalarLine = {
  blank: boolean
  moreIndented: boolean
  text: string
}

function countIndent(content: string): number {
  return content.match(/^ */)?.[0].length ?? 0
}

function parseBlockScalarHeader(raw: string, line: number): BlockScalarHeader {
  const style = raw[0] === '|' ? 'literal' : 'folded'
  let chomp: BlockScalarChomp = 'clip'
  let hasChomp = false
  let indent: number | undefined

  for (const char of raw.slice(1)) {
    if (char === '-' || char === '+') {
      if (hasChomp) throw createParseError(line, 'Invalid block scalar header')

      chomp = char === '-' ? 'strip' : 'keep'
      hasChomp = true
      continue
    }

    if (/^[1-9]$/.test(char)) {
      if (typeof indent === 'number') throw createParseError(line, 'Invalid block scalar header')

      indent = Number(char)
      continue
    }

    throw createParseError(line, 'Invalid block scalar header')
  }

  return {
    chomp,
    indent,
    style,
  }
}

function composeLiteral(lines: BlockScalarLine[]): string {
  return lines.map((line) => line.text).join('\n')
}

function composeFolded(lines: BlockScalarLine[]): string {
  let result = ''

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    result += line.text

    const next = lines[i + 1]
    if (!next) continue

    if (line.blank) {
      result += '\n'
      continue
    }

    if (next.blank) continue

    result += line.moreIndented || next.moreIndented ? '\n' : ' '
  }

  return result
}

function applyChomp(
  text: string,
  lines: BlockScalarLine[],
  trailingBlankLines: number,
  chomp: BlockScalarChomp,
): string {
  if (chomp === 'strip') return text

  if (chomp === 'clip') return lines.length ? `${text}\n` : ''

  if (!lines.length) return '\n'.repeat(trailingBlankLines)

  return `${text}\n${'\n'.repeat(trailingBlankLines)}`
}

function composeBlockScalar(lines: BlockScalarLine[], header: BlockScalarHeader): string {
  let trailingBlankLines = 0

  while (trailingBlankLines < lines.length && lines[lines.length - 1 - trailingBlankLines].blank)
    trailingBlankLines++

  const contentLines =
    trailingBlankLines > 0 ? lines.slice(0, lines.length - trailingBlankLines) : lines
  const text =
    header.style === 'literal' ? composeLiteral(contentLines) : composeFolded(contentLines)

  return applyChomp(text, contentLines, trailingBlankLines, header.chomp)
}

function findNextParsedLine(lines: ParsedLine[], index: number, endLine: number): number {
  let nextIndex = index + 1

  while (nextIndex < lines.length && lines[nextIndex].line < endLine) nextIndex++

  return nextIndex
}

/**
 * Check whether an inline value token starts a YAML block scalar.
 *
 * @param raw - Raw value token after anchor parsing.
 * @returns `true` when the token starts with `|` or `>`.
 */
export function isBlockScalarHeader(raw: string): boolean {
  return raw.startsWith('|') || raw.startsWith('>')
}

/**
 * Parse a literal (`|`) or folded (`>`) block scalar.
 *
 * @param lines - Comment-stripped parsed lines.
 * @param index - Parsed line index containing the block scalar header.
 * @param parentIndent - Indentation level of the mapping or sequence entry.
 * @param rawHeader - Raw block scalar header token.
 * @param context - Parse context containing raw source lines.
 * @returns Parsed block scalar string and next parsed-line index.
 */
export function parseBlockScalar(
  lines: ParsedLine[],
  index: number,
  parentIndent: number,
  rawHeader: string,
  context: ParseContext,
): ParseResult {
  const line = lines[index]
  const header = parseBlockScalarHeader(rawHeader, line.line)
  let blockIndent = typeof header.indent === 'number' ? parentIndent + header.indent : undefined
  const blockLines: BlockScalarLine[] = []
  let rawIndex = line.line
  let endLine = context.sourceLines.length + 1

  while (rawIndex < context.sourceLines.length) {
    const sourceLine = context.sourceLines[rawIndex]
    const indent = countIndent(sourceLine.content)
    const blank = !sourceLine.content.trim()

    if (blank) {
      blockLines.push({
        blank: true,
        moreIndented: false,
        text: '',
      })
      rawIndex++
      continue
    }

    if (typeof blockIndent !== 'number') {
      if (indent <= parentIndent) {
        endLine = sourceLine.line
        break
      }

      blockIndent = indent
    }

    if (indent < blockIndent) {
      if (indent > parentIndent)
        throw createParseError(
          sourceLine.line,
          `Block scalar content indentation is less than expected ${blockIndent} spaces`,
        )

      endLine = sourceLine.line
      break
    }

    blockLines.push({
      blank: false,
      moreIndented: indent > blockIndent,
      text: sourceLine.content.slice(blockIndent),
    })
    rawIndex++
  }

  return {
    nextIndex: findNextParsedLine(lines, index, endLine),
    value: composeBlockScalar(blockLines, header),
  }
}
