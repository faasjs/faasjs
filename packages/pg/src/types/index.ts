/**
 * Consumer-extended table map used by `@faasjs/pg` declaration merging.
 *
 * Extend this interface in application code with `declare module '@faasjs/pg'`.
 * Query builders then infer valid table names, columns, values, and selected row
 * shapes from the merged map. Unknown tables remain usable but fall back to
 * permissive `string` and `any` types.
 *
 * @example
 * ```ts
 * import type { Tables } from '@faasjs/pg'
 *
 * declare module '@faasjs/pg' {
 *   interface Tables {
 *     users: {
 *       id: string
 *       email: string
 *       metadata: { plan: string }
 *     }
 *   }
 * }
 * ```
 */
export interface Tables {}

/**
 * Known table names from the merged {@link Tables} interface.
 */
export type TableName = Extract<keyof Tables, string>

/**
 * Row type for a known table name, or a permissive record for unknown tables.
 */
export type TableType<T extends string = string> = T extends TableName
  ? Tables[T]
  : Record<string, any>

/**
 * Column-name union for a known table, or `string` for unknown tables.
 */
export type ColumnName<T extends string = string> = T extends keyof Tables
  ? Extract<keyof Tables[T], string>
  : string

/**
 * Value type for a known table column, or `any` when the table or column is unknown.
 */
export type ColumnValue<T extends string = string, C extends string = string> = T extends TableName
  ? C extends keyof Tables[T]
    ? Tables[T][C]
    : any
  : any
