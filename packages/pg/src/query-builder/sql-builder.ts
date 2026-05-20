import { escapeIdentifier } from '../utils'
import type { WhereCondition, JoinCondition } from './types'

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
              return `${prefix}${escapeIdentifier(column)} = ANY(?)`
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

export function buildJoinSql(joinConditions: JoinCondition[]): string {
  return joinConditions
    .map(
      (condition) =>
        `${condition.type === 'LEFT' ? 'LEFT JOIN' : 'JOIN'} ${escapeIdentifier(condition.table)} ON ${escapeIdentifier(condition.left)} ${condition.operator} ${escapeIdentifier(condition.right)}`,
    )
    .join(' ')
}

export function buildInsertSql<T extends string>(
  table: T,
  values: Record<string, any>[],
  returning?: (keyof any)[] | ['*'],
): { sql: string; params: any[] } {
  const sql: string[] = [
    'INSERT INTO',
    escapeIdentifier(table),
    '(',
    Object.keys(values[0]).map(escapeIdentifier).join(','),
    ') VALUES',
    values
      .map(
        (v) =>
          `(${Object.keys(v)
            .map(() => '?')
            .join(',')})`,
      )
      .join(','),
  ]

  if (returning?.length)
    sql.push('RETURNING', returning.map((column) => escapeIdentifier(column as string)).join(','))

  return {
    sql: sql.join(' '),
    params: values.map((v) => Object.values(v)).flat(),
  }
}

export function buildUpdateSql<T extends string>(
  table: T,
  values: Record<string, any>,
  whereSql: string,
  whereParams: any[],
  returning?: (keyof any)[] | ['*'],
): { sql: string; params: any[] } {
  const params: any[] = Object.values(values)

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

  if (returning?.length)
    sql.push('RETURNING', returning.map((column) => escapeIdentifier(column as string)).join(','))

  return {
    sql: sql.join(' '),
    params,
  }
}

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

export function buildUpsertSql<T extends string>(
  table: T,
  values: Record<string, any>[],
  conflict: string[],
  update?: string[],
  returning?: (keyof any)[] | ['*'],
): { sql: string; params: any[] } {
  const sql: string[] = [
    'INSERT INTO',
    escapeIdentifier(table),
    '(',
    Object.keys(values[0]).map(escapeIdentifier).join(','),
    ') VALUES',
    values
      .map(
        (v) =>
          `(${Object.keys(v)
            .map(() => '?')
            .join(',')})`,
      )
      .join(','),
    'ON CONFLICT',
    `(${conflict.map(escapeIdentifier).join(',')})`,
    'DO UPDATE SET',
    Object.keys(values[0])
      .filter(
        (column) =>
          !conflict.includes(column as string) &&
          (update ? update.includes(column as keyof (typeof values)[0]) : true),
      )
      .map((column) => `${escapeIdentifier(column)} = EXCLUDED.${escapeIdentifier(column)}`)
      .join(','),
    returning?.length
      ? `RETURNING ${returning.map((c) => escapeIdentifier(c as string)).join(',')}`
      : '',
  ].filter(Boolean)

  return {
    sql: sql.join(' '),
    params: values.map((v) => Object.values(v)).flat(),
  }
}
