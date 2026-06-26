import { escapeIdentifier } from '../utils'
import type { WhereCondition, JoinCondition } from './types'

type ReturningColumns = (keyof any)[] | ['*']

function getInsertColumns(values: Record<string, any>[]): string[] {
  return Object.keys(values[0])
}

function buildValuesPlaceholders(values: Record<string, any>[]): string {
  return values
    .map(
      (value) =>
        `(${Object.keys(value)
          .map(() => '?')
          .join(',')})`,
    )
    .join(',')
}

function buildMutationParams(values: Record<string, any>[]): any[] {
  return values.map((value) => Object.values(value)).flat()
}

function buildReturningSql(returning?: ReturningColumns): string {
  if (!returning?.length) return ''

  return `RETURNING ${returning.map((column) => escapeIdentifier(column as string)).join(',')}`
}

/**
 * Builds a parameterized WHERE clause from an array of conditions.
 *
 * @param whereConditions - The array of where conditions.
 * @param mode - Whether the clause is for a query or an update. In update mode, array operators use `ANY`/`ALL` for compatibility.
 * @returns The SQL string and bound parameters.
 */
export function buildWhereSql(
  whereConditions: WhereCondition<string>[],
  mode: 'query' | 'update' = 'query',
): { sql: string; params: any[] } {
  const sql: string[] = []
  const params: any[] = []

  if (whereConditions.length > 0) {
    sql.push(
      'WHERE',
      whereConditions
        .map((condition, index) => {
          const prefix = index > 0 ? `${condition.type} ` : ''

          if (condition.kind === 'raw') {
            params.push(...condition.params)
            return `${prefix}(${condition.sql})`
          }

          const { column, operator, value } = condition

          if (operator === 'IS NULL' || operator === 'IS NOT NULL')
            return `${prefix}${escapeIdentifier(column)} ${operator}`

          if (operator === 'IN' || operator === 'NOT IN') {
            if (mode === 'update') {
              params.push(value)
              const arrayOperator = operator === 'IN' ? '= ANY(?)' : '<> ALL(?)'

              return `${prefix}${escapeIdentifier(column)} ${arrayOperator}`
            }

            params.push(...value)
            return `${prefix}${escapeIdentifier(column)} ${operator} (${value.map(() => '?').join(',')})`
          }

          params.push(value)
          return `${prefix}${escapeIdentifier(column)} ${operator} ?`
        })
        .join(' '),
    )
  }

  return {
    sql: sql.join(' '),
    params,
  }
}

/**
 * Builds a JOIN clause from an array of join conditions.
 *
 * @param joinConditions - The array of join conditions.
 * @returns The JOIN clause SQL string, or an empty string if no conditions exist.
 */
export function buildJoinSql(joinConditions: JoinCondition[]): string {
  return joinConditions
    .map(
      (condition) =>
        `${condition.type === 'LEFT' ? 'LEFT JOIN' : 'JOIN'} ${escapeIdentifier(condition.table)} ON ${escapeIdentifier(condition.left)} ${condition.operator} ${escapeIdentifier(condition.right)}`,
    )
    .join(' ')
}

/**
 * Builds an INSERT SQL statement.
 *
 * @param table - The target table name.
 * @param values - The array of records to insert.
 * @param returning - Optional columns to return after the insert.
 * @returns The INSERT SQL string and bound parameters.
 */
export function buildInsertSql<T extends string>(
  table: T,
  values: Record<string, any>[],
  returning?: ReturningColumns,
): { sql: string; params: any[] } {
  const returningSql = buildReturningSql(returning)
  const sql: string[] = [
    'INSERT INTO',
    escapeIdentifier(table),
    '(',
    getInsertColumns(values).map(escapeIdentifier).join(','),
    ') VALUES',
    buildValuesPlaceholders(values),
  ]

  if (returningSql) sql.push(returningSql)

  return {
    sql: sql.join(' '),
    params: buildMutationParams(values),
  }
}

/**
 * Builds an UPDATE SQL statement.
 *
 * @param table - The target table name.
 * @param values - The column-value pairs to update.
 * @param whereSql - The pre-built WHERE clause SQL.
 * @param whereParams - The bound parameters for the WHERE clause.
 * @param returning - Optional columns to return after the update.
 * @returns The UPDATE SQL string and bound parameters.
 */
export function buildUpdateSql<T extends string>(
  table: T,
  values: Record<string, any>,
  whereSql: string,
  whereParams: any[],
  returning?: ReturningColumns,
): { sql: string; params: any[] } {
  const params: any[] = Object.values(values)
  const returningSql = buildReturningSql(returning)

  const sql: string[] = [
    'UPDATE',
    escapeIdentifier(table),
    'SET',
    Object.keys(values)
      .map((column) => `${escapeIdentifier(column)} = ?`)
      .join(','),
  ]

  if (whereSql) sql.push(whereSql)
  params.push(...whereParams)

  if (returningSql) sql.push(returningSql)

  return {
    sql: sql.join(' '),
    params,
  }
}

/**
 * Builds an UPDATE … SET column = column || ? statement to atomically merge JSON/JSONB fields.
 *
 * @param table - The target table name.
 * @param column - The JSON/JSONB column to merge into.
 * @param value - The value to merge.
 * @param whereSql - The pre-built WHERE clause SQL.
 * @param whereParams - The bound parameters for the WHERE clause.
 * @returns The UPDATE SQL string and bound parameters.
 */
export function buildUpdateJsonSql<T extends string>(
  table: T,
  column: string,
  value: any,
  whereSql: string,
  whereParams: any[],
): { sql: string; params: any[] } {
  return {
    sql: [
      'UPDATE',
      escapeIdentifier(table),
      'SET',
      `${escapeIdentifier(column)} = ${escapeIdentifier(column)} || ?`,
      whereSql,
    ].join(' '),
    params: [value, ...whereParams],
  }
}

/**
 * Builds a DELETE SQL statement.
 *
 * @param table - The target table name.
 * @param whereSql - The pre-built WHERE clause SQL.
 * @param whereParams - The bound parameters for the WHERE clause.
 * @returns The DELETE SQL string and bound parameters.
 */
export function buildDeleteSql<T extends string>(
  table: T,
  whereSql: string,
  whereParams: any[],
): { sql: string; params: any[] } {
  return {
    sql: ['DELETE FROM', escapeIdentifier(table), whereSql].join(' '),
    params: whereParams,
  }
}

/**
 * Builds an upsert (INSERT … ON CONFLICT … DO UPDATE) SQL statement.
 *
 * @param table - The target table name.
 * @param values - The array of records to upsert.
 * @param conflict - The conflict columns for the ON CONFLICT clause.
 * @param update - Optional columns to update on conflict. If omitted, all non-conflict columns are updated.
 * @param returning - Optional columns to return after the upsert.
 * @returns The upsert SQL string and bound parameters.
 */
export function buildUpsertSql<T extends string>(
  table: T,
  values: Record<string, any>[],
  conflict: string[],
  update?: string[],
  returning?: ReturningColumns,
): { sql: string; params: any[] } {
  const columns = getInsertColumns(values)
  const returningSql = buildReturningSql(returning)
  const sql: string[] = [
    'INSERT INTO',
    escapeIdentifier(table),
    '(',
    columns.map(escapeIdentifier).join(','),
    ') VALUES',
    buildValuesPlaceholders(values),
    'ON CONFLICT',
    `(${conflict.map(escapeIdentifier).join(',')})`,
    'DO UPDATE SET',
    columns
      .filter(
        (column) =>
          !conflict.includes(column as string) &&
          (update ? update.includes(column as keyof (typeof values)[0]) : true),
      )
      .map((column) => `${escapeIdentifier(column)} = EXCLUDED.${escapeIdentifier(column)}`)
      .join(','),
    returningSql,
  ].filter(Boolean)

  return {
    sql: sql.join(' '),
    params: buildMutationParams(values),
  }
}
