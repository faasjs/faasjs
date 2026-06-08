/**
 * Trusted SQL fragment marker used to bypass identifier or value escaping.
 *
 * Values of this type are produced by {@link rawSql}. Treat them as already-safe
 * SQL text; the library will embed them without quoting or parameter binding.
 */
export type RawSql = string & { __raw: true }

/**
 * Escapes a SQL identifier, preserving trusted {@link RawSql} fragments.
 *
 * Dotted identifiers are escaped segment by segment, `*` and `COUNT(*)` are preserved
 * for query-builder output, and non-string values throw before SQL is generated.
 *
 * @param identifier - Table name, column name, dotted identifier, or trusted raw fragment.
 * @returns Escaped identifier string ready to be embedded into SQL text.
 */
export function escapeIdentifier(identifier: string | RawSql): string {
  if (
    identifier &&
    typeof identifier === 'object' &&
    '__raw' in identifier &&
    (identifier as RawSql).__raw === true
  )
    return (identifier as RawSql).toString()

  if (typeof identifier !== 'string')
    throw Error(`Identifier must be a string: ${String(identifier)}`)

  return `"${identifier.replace(/"/g, '""').replace(/\./g, '"."')}"`
    .replace(/^["]{1,}/, '"')
    .replace(/["]{1,}$/, '"')
    .replace('"*"', '*')
    .replace(/"COUNT\(\*\)"/i, 'COUNT(*)')
}

/**
 * Escapes a literal value for inline SQL generation.
 *
 * Prefer bound parameters for runtime values whenever possible. This helper exists
 * for schema generation where PostgreSQL requires inline defaults. Passing a
 * {@link RawSql} value bypasses escaping.
 *
 * @param value - Value to serialize into SQL text.
 * @returns SQL literal representation of the value.
 */
export function escapeValue(value: any): string {
  if (value && typeof value === 'object' && '__raw' in value && value.__raw === true) {
    return value.toString()
  }

  if (value === null) {
    return 'NULL'
  }

  if (typeof value === 'boolean') {
    return value ? 'TRUE' : 'FALSE'
  }

  if (typeof value === 'number') {
    return value.toString()
  }

  if (typeof value === 'string') {
    if (value === 'now()') return value

    return `'${value.replace(/'/g, "''")}'`
  }

  if (Array.isArray(value)) {
    return `ARRAY[${value.map(escapeValue).join(',')}]`
  }

  if (value instanceof Date) {
    return `'${value.toISOString()}'`
  }

  if (typeof value === 'object') {
    return `'${JSON.stringify(value).replace(/'/g, "''")}'`
  }

  throw Error(`Unsupported value: ${value}`)
}

/**
 * Creates a raw SQL value object.
 *
 * Use this for trusted SQL fragments such as function calls, expressions, or join
 * operands that should not be quoted as identifiers or serialized as values. Never
 * wrap user input with `rawSql`; use query parameters instead.
 *
 * @param value - The raw SQL string.
 * @returns An object representing the raw SQL value with a custom `toString` method.
 */
export function rawSql(value: string): RawSql {
  return Object.assign(value, {
    __raw: true,
    toString: () => value,
  }) as RawSql
}

/**
 * Checks whether a value is a `TemplateStringsArray`.
 *
 * Used by {@link createTemplateStringsArray} and raw query execution to distinguish
 * template-literal SQL from string SQL.
 */
export function isTemplateStringsArray(value: any): value is TemplateStringsArray {
  return Array.isArray(value) && typeof value[0] === 'string' && 'raw' in value
}

/**
 * Normalizes a SQL string or template input into a `TemplateStringsArray`.
 *
 * String input is split on `?`, so each `?` becomes a `postgres.js` parameter gap.
 * Template-literal input is returned unchanged.
 *
 * @param str - SQL source string or template literal array.
 * @returns Template-strings representation for `postgres.js`.
 */
export function createTemplateStringsArray(
  str: string | TemplateStringsArray,
): TemplateStringsArray {
  if (isTemplateStringsArray(str)) return str

  const parts = str.split(/\?/g)

  const arr = [...parts]

  Object.defineProperty(arr, 'raw', {
    value: Object.freeze([...parts]),
  })

  return Object.freeze(arr) as TemplateStringsArray
}
