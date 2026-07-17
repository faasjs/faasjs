import type { ColumnName, Tables, TableType } from '../types'
import type { RawSql } from '../utils'

/**
 * Readonly list of comparison operators for scalar values.
 */
export const NormalOperators = ['=', '!=', '<', '<=', '>', '>='] as const

/**
 * Readonly list of array membership operators.
 */
export const ArrayOperators = ['IN', 'NOT IN'] as const

/**
 * Readonly list of null-check operators.
 */
export const NullOperators = ['IS NULL', 'IS NOT NULL'] as const

/**
 * Readonly list of JSON containment operators.
 */
export const JsonOperators = ['@>'] as const

/**
 * Readonly list of pattern-matching operators.
 */
export const PatternOperators = ['LIKE', 'ILIKE', 'NOT LIKE', 'NOT ILIKE'] as const

/**
 * Readonly list of all supported query operators.
 */
export const Operators = [
  ...NormalOperators,
  ...ArrayOperators,
  ...NullOperators,
  ...PatternOperators,
  ...JsonOperators,
] as const

/**
 * Union type of all supported query operators.
 */
export type Operator = (typeof Operators)[number]

/**
 * Type guard for validating that a value is a known {@link Operator}.
 */
export function isOperator(value: unknown): value is Operator {
  return typeof value === 'string' && Operators.includes(value as Operator)
}

/**
 * Type guard for validating that a value is a normal comparison operator.
 */
export function isNormalOperator(value: unknown): value is (typeof NormalOperators)[number] {
  return (
    typeof value === 'string' && NormalOperators.includes(value as (typeof NormalOperators)[number])
  )
}

/**
 * Valid ORDER BY directions.
 */
export const QueryOrderDirections = ['ASC', 'DESC', 'asc', 'desc'] as const

/**
 * ORDER BY direction literal type.
 */
export type QueryOrderDirection = (typeof QueryOrderDirections)[number]

/**
 * Describes a single WHERE clause condition, either a column-based comparison or a raw SQL fragment.
 */
export type WhereCondition<T extends string> =
  | {
      kind: 'column'
      type: 'AND' | 'OR'
      column: ColumnName<T> | string
      operator: Operator
      value: any
    }
  | {
      kind: 'raw'
      type: 'AND' | 'OR'
      sql: string
      params: any[]
    }

/**
 * Describes a single ORDER BY condition, either a column reference or a raw SQL fragment.
 */
export type OrderByCondition<T extends string> =
  | {
      type: 'column'
      column: ColumnName<T> | string
      direction: QueryOrderDirection
    }
  | {
      type: 'raw'
      sql: string
      params: any[]
    }

/**
 * Describes a JOIN clause condition.
 */
export type JoinCondition = {
  type: 'INNER' | 'LEFT'
  table: string | RawSql
  left: string | RawSql
  operator: (typeof NormalOperators)[number]
  right: string | RawSql
}

type IsObject<T> = T extends object ? true : false

type GetTableType<T extends string> = T extends keyof Tables ? Tables[T] : never

type JsonbColumns<T extends string, Table = TableType<T>> = {
  [K in keyof Table]: IsObject<Table[K]> extends true ? K : never
}[keyof Table]

type JsonbFields<T extends string, C extends JsonbColumns<T>> = keyof GetTableType<T>[C &
  keyof GetTableType<T>]

/**
 * Selects a column under a different result key.
 *
 * @template T - Table name used to infer valid columns.
 */
type AliasedSelectField<T extends string> = {
  /** Column to select. */
  column: ColumnName<T>
  /** Result key for the selected column. */
  alias: string
}

/**
 * Select a subset of fields from a JSON or JSONB column.
 *
 * Used by {@link QueryBuilder.select} to emit `jsonb_build_object(...)` for a
 * typed JSON column while keeping the result row narrowed to the selected keys.
 *
 * @template T - Table name used to infer JSON-capable columns and fields.
 */
type JsonSelectField<T extends string> = {
  /** JSON/JSONB column whose fields should be projected. */
  column: JsonbColumns<T>
  /** Field names to include from the JSON/JSONB column. */
  fields: JsonbFields<T, JsonbColumns<T>>[]
  /** Optional result alias. Defaults to the source column name. */
  alias?: string
}

type SelectField<T extends string> = ColumnName<T> | AliasedSelectField<T> | JsonSelectField<T>

type SelectAlias<Field, Fallback extends string> = Field extends {
  alias: infer Alias extends string
}
  ? Alias
  : Fallback

type InferColumnType<T extends string, Field extends SelectField<T>> = Field extends {
  column: infer C extends JsonbColumns<T>
  fields: infer Fields
}
  ? Fields extends JsonbFields<T, C>[]
    ? {
        [K in SelectAlias<Field, C & string>]: Pick<
          GetTableType<T>[C & keyof GetTableType<T>],
          Fields[number]
        >
      }
    : never
  : Field extends {
        column: infer C extends keyof GetTableType<T> & string
        alias: infer Alias extends string
      }
    ? { [K in Alias]: GetTableType<T>[C] }
    : Field extends keyof GetTableType<T>
      ? { [K in Field]: GetTableType<T>[K] }
      : never

type Flatten<T> = { [K in keyof T]: T[K] }

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void
  ? I
  : never

type MergeTypes<T> = T extends any[] ? Flatten<UnionToIntersection<T[number]>> : T

/**
 * Infers the result row type for a SELECT query based on the table name and selected columns.
 *
 * @template TName - The table name.
 * @template ColumnNames - The columns selected, or defaults to all columns.
 */
export type InferTResult<
  TName extends string,
  ColumnNames extends SelectField<TName>[] = ColumnName<TName>[],
> = ColumnNames extends ['*']
  ? TableType<TName>
  : MergeTypes<{
      [K in keyof ColumnNames]: InferColumnType<TName, ColumnNames[K]>
    }>

/**
 * Options for a `SELECT ... FOR UPDATE` locking clause.
 */
export type ForUpdateOptions = {
  /** Tables or aliases whose selected rows should be locked. */
  of?: string | readonly string[]
  /** Fail immediately instead of waiting for a conflicting row lock. */
  noWait?: boolean
  /** Skip rows that cannot be locked immediately. */
  skipLocked?: boolean
}

export type { AliasedSelectField, JsonSelectField, SelectField }
