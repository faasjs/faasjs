import type { ColumnName, Tables, TableType } from '../types'
import type { RawSql } from '../utils'

/**
 * Comparison operators for scalar values.
 */
export const NormalOperators = ['=', '!=', '<', '<=', '>', '>='] as const

/**
 * Array membership operators.
 */
export const ArrayOperators = ['IN', 'NOT IN'] as const

/**
 * Null-check operators.
 */
export const NullOperators = ['IS NULL', 'IS NOT NULL'] as const

/**
 * JSON containment operators.
 */
export const JsonOperators = ['@>'] as const

/**
 * Pattern-matching operators.
 */
export const PatternOperators = ['LIKE', 'ILIKE', 'NOT LIKE', 'NOT ILIKE'] as const

/**
 * Union of all supported query operators.
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

type JsonSelectField<T extends string> = {
  column: JsonbColumns<T>
  fields: JsonbFields<T, JsonbColumns<T>>[]
  alias?: string
}

type InferJsonFields<
  T extends string,
  C extends JsonbColumns<T>,
  Fields extends JsonbFields<T, C>[],
> = {
  [K in C & keyof GetTableType<T>]: Pick<GetTableType<T>[K], Fields[number]>
}

type InferColumnType<T extends string, C extends ColumnName<T> | JsonSelectField<T>> =
  C extends JsonSelectField<T>
    ? InferJsonFields<T, C['column'], C['fields']>
    : C extends keyof GetTableType<T>
      ? { [K in C]: GetTableType<T>[K] }
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
  ColumnNames extends (ColumnName<TName> | JsonSelectField<TName>)[] = ColumnName<TName>[],
> = ColumnNames extends ['*']
  ? TableType<TName>
  : MergeTypes<{
      [K in keyof ColumnNames]: InferColumnType<TName, ColumnNames[K]>
    }>

export type { JsonSelectField }
