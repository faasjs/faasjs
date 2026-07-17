import { escapeIdentifier } from './utils'

const SQL_EXPRESSION = Symbol('sql-expression')
const SQL_REFERENCE = Symbol('sql-reference')

/**
 * A parameterized SQL expression created by {@link sql}.
 *
 * Expressions can be used as values in {@link QueryBuilder.update}. Static template
 * text is treated as trusted application SQL, identifiers should be inserted with
 * `sql.ref()`, and every other interpolation is bound as a query parameter.
 */
export type SqlExpression = {
  readonly text: string
  readonly params: readonly unknown[]
  readonly [SQL_EXPRESSION]: true
}

/**
 * An escaped identifier marker created by {@link sql.ref}.
 */
export type SqlReference = {
  readonly identifier: string
  readonly [SQL_REFERENCE]: true
}

function isSqlReference(value: unknown): value is SqlReference {
  return (
    typeof value === 'object' &&
    value !== null &&
    SQL_REFERENCE in value &&
    value[SQL_REFERENCE] === true
  )
}

/**
 * Checks whether a value is a parameterized {@link SqlExpression}.
 *
 * @internal
 */
export function isSqlExpression(value: unknown): value is SqlExpression {
  return (
    typeof value === 'object' &&
    value !== null &&
    SQL_EXPRESSION in value &&
    value[SQL_EXPRESSION] === true
  )
}

function createSqlExpression(
  strings: TemplateStringsArray,
  values: readonly unknown[],
): SqlExpression {
  const text: string[] = [strings[0]]
  const params: unknown[] = []

  values.forEach((value, index) => {
    if (isSqlReference(value)) {
      text.push(escapeIdentifier(value.identifier))
    } else {
      text.push('?')
      params.push(value)
    }

    text.push(strings[index + 1])
  })

  return Object.freeze({
    text: text.join(''),
    params: Object.freeze(params),
    [SQL_EXPRESSION]: true as const,
  })
}

/**
 * Creates a parameterized SQL expression for {@link QueryBuilder.update}.
 *
 * Use {@link sql.ref} for identifiers. All other interpolated values are converted
 * to bound parameters; never concatenate runtime input into the static template text.
 *
 * @example
 * ```ts
 * await client.query('jobs').where('id', id).update({
 *   attempts: sql`${sql.ref('attempts')} + ${1}`,
 *   updated_at: sql`NOW()`,
 * })
 * ```
 */
export const sql = Object.assign(
  (strings: TemplateStringsArray, ...values: unknown[]) => createSqlExpression(strings, values),
  {
    /**
     * Creates an escaped SQL identifier reference for interpolation into {@link sql}.
     */
    ref: (identifier: string): SqlReference =>
      Object.freeze({
        identifier,
        [SQL_REFERENCE]: true as const,
      }),
  },
)
