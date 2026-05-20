import { createParseError } from './scanner'

export function parseDoubleQuotedScalar(value: string, line: number): string {
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

export function parseSingleQuotedScalar(value: string, line: number): string {
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

export function parseQuotedScalar(value: string, line: number): string {
  if (value.startsWith('"')) return parseDoubleQuotedScalar(value, line)

  if (value.startsWith("'")) return parseSingleQuotedScalar(value, line)

  throw createParseError(line, 'Invalid quoted string')
}

export function parsePlainScalar(value: string): unknown {
  if (value === '~') return null

  const lower = value.toLowerCase()
  if (lower === 'null') return null
  if (lower === 'true') return true
  if (lower === 'false') return false

  if (/^[-+]?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][-+]?\d+)?$/.test(value)) return Number(value)

  return value
}

export function parseInlineValue(value: string, line: number): unknown {
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

export function parseKey(rawKey: string, line: number): string {
  if (!rawKey.length) throw createParseError(line, 'Missing mapping key')

  if (rawKey.startsWith('"') || rawKey.startsWith("'")) {
    const key = parseQuotedScalar(rawKey, line)
    return key
  }

  if (rawKey.startsWith('[') || rawKey.startsWith('{'))
    throw createParseError(line, 'Complex mapping key is not supported')

  return rawKey
}
