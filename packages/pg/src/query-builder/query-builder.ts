import type { Client } from '../client'
import type { ColumnName, ColumnValue, TableType } from '../types'
import type { RawSql } from '../utils'
import { escapeIdentifier } from '../utils'
import {
  buildInsertSql,
  buildUpdateSql,
  buildUpdateJsonSql,
  buildDeleteSql,
  buildUpsertSql,
  buildWhereSql,
  buildJoinSql,
} from './sql-builder'
import { isOperator, isNormalOperator, QueryOrderDirections } from './types'
import type {
  WhereCondition,
  OrderByCondition,
  JoinCondition,
  JsonSelectField,
  InferTResult,
  QueryOrderDirection,
  NormalOperators,
  ArrayOperators,
  NullOperators,
  PatternOperators,
  JsonOperators,
} from './types'

/**
 * Builds and executes parameterized PostgreSQL queries through a fluent, chainable API.
 *
 * Supports SELECT, INSERT, UPDATE, DELETE, and upsert operations with strongly-typed
 * WHERE clauses, JOINs, ORDER BY, LIMIT/OFFSET, and result-type inference from the
 * table type map declared via the exported `Tables` interface. Column and table identifiers are escaped
 * automatically; raw fragments are accepted only through the explicit `*Raw` methods
 * and should be reserved for trusted SQL controlled by the application.
 *
 * UPDATE, JSON UPDATE, and DELETE require at least one WHERE condition and throw
 * `Missing where conditions` otherwise.
 *
 * @template T - The table name.
 * @template TResult - The inferred result row type.
 *
 * @example
 * ```ts
 * const users = await db('users').select('id', 'name').where('id', '>', 5).limit(10)
 * // SELECT "id","name" FROM "users" WHERE "id" > ? LIMIT ?
 * ```
 */
export class QueryBuilder<T extends string = string, TResult = InferTResult<T>[]> {
  private client: Client
  private table: T
  private selectColumns: (ColumnName<T> | JsonSelectField<T>)[] = []
  private whereConditions: WhereCondition<T>[] = []
  private limitValue?: number
  private offsetValue?: number
  private orderByConditions: OrderByCondition<T>[] = []
  private joinConditions: JoinCondition[] = []

  /**
   * @param client - The database client to execute queries against.
   * @param table - The table name to target.
   */
  constructor(client: Client, table: T) {
    this.client = client
    this.table = table
  }

  /**
   * Selects specific columns for the query.
   *
   * Calling `select()` with no columns leaves the current selection unchanged. JSONB
   * field selectors use `jsonb_build_object` and default their alias to the source
   * JSON column name.
   *
   * @param {...ColumnNames} columns - The columns to select.
   *
   * @example
   * ```ts
   * const users = await db('users').select('id', 'name') // SELECT id, name FROM users
   *
   * const users = await db('users').select('id', { column: 'data', fields: ['email'] }) // SELECT id, jsonb_build_object('email', data->'email') AS data FROM users
   * ```
   */
  select<ColumnNames extends (ColumnName<T> | JsonSelectField<T>)[]>(
    ...columns: ColumnNames
  ): QueryBuilder<T, InferTResult<T, ColumnNames>[]> {
    if (columns?.length > 0) this.selectColumns = columns

    return this as any
  }

  /**
   * Applies a WHERE condition to the query builder.
   *
   * Passing `(column, value)` uses `=`. Passing `(column, operator, value)` requires
   * one of the exported `Operators` literals; invalid operators throw before SQL is
   * generated. `IN` and `NOT IN` expect arrays, and `IS NULL` / `IS NOT NULL` do
   * not bind a value.
   *
   * @param column - The column to filter on.
   * @param operator - The operator to use for comparison.
   * @param value - The value to compare against.
   *
   * @example
   * ```ts
   * await query('users').where('id', 1) // WHERE id = 1
   *
   * await query('users').where('id', '>', 1) // WHERE id > 1
   *
   * await query('users').where('id', 'IN', [1, 2, 3]) // WHERE id IN (1, 2, 3)
   *
   * await query('users').where('data', '@>', { email: 'example@example.com' }) // WHERE data @> '{"email": "example@example.com"}'
   * ```
   */
  where<C extends ColumnName<T>>(
    column: C,
    operator: (typeof NormalOperators)[number],
    value?: ColumnValue<T, C>,
  ): QueryBuilder<T, TResult>
  where<C extends ColumnName<T>>(
    column: C,
    operator: (typeof ArrayOperators)[number],
    value: ColumnValue<T, C>[],
  ): QueryBuilder<T, TResult>
  where<C extends ColumnName<T>>(
    column: C,
    operator: (typeof NullOperators)[number],
  ): QueryBuilder<T, TResult>
  where<C extends ColumnName<T>>(
    column: C,
    operator: (typeof PatternOperators)[number],
    value: ColumnValue<T, C>,
  ): QueryBuilder<T, TResult>
  where<C extends ColumnName<T>>(
    column: C,
    operator: (typeof JsonOperators)[number],
    value: Partial<ColumnValue<T, C>>,
  ): QueryBuilder<T, TResult>
  where<C extends ColumnName<T>>(column: C, value: ColumnValue<T, C>): QueryBuilder<T, TResult>
  where(column: ColumnName<T>, operatorOrValue: unknown, value?: unknown) {
    if (
      typeof value === 'undefined' &&
      !isNormalOperator(operatorOrValue) &&
      operatorOrValue !== 'IS NULL' &&
      operatorOrValue !== 'IS NOT NULL'
    ) {
      this.whereConditions.push({
        kind: 'column',
        type: 'AND',
        column,
        operator: '=',
        value: operatorOrValue,
      })

      return this
    }

    if (!isOperator(operatorOrValue))
      throw new Error(`Invalid operator: ${String(operatorOrValue)}`)

    this.whereConditions.push({
      kind: 'column',
      type: 'AND',
      column,
      operator: operatorOrValue,
      value,
    })

    return this
  }

  /**
   * Applies an OR WHERE condition to the query builder.
   *
   * The same operator rules as {@link where} apply, but the condition is joined with
   * `OR` instead of `AND`.
   *
   * @param column - The column to filter on.
   * @param operator - The operator to use for comparison.
   * @param value - The value to compare against.
   * @example
   * ```ts
   * await query('users').where('id', 1).orWhere('id', 2) // WHERE id = 1 OR id = 2
   * ```
   */
  orWhere<C extends ColumnName<T>>(
    column: C,
    operator: (typeof NormalOperators)[number],
    value?: ColumnValue<T, C>,
  ): QueryBuilder<T, TResult>
  orWhere<C extends ColumnName<T>>(
    column: C,
    operator: (typeof ArrayOperators)[number],
    value: ColumnValue<T, C>[],
  ): QueryBuilder<T, TResult>
  orWhere<C extends ColumnName<T>>(
    column: C,
    operator: (typeof NullOperators)[number],
  ): QueryBuilder<T, TResult>
  orWhere<C extends ColumnName<T>>(
    column: C,
    operator: (typeof PatternOperators)[number],
    value: ColumnValue<T, C>,
  ): QueryBuilder<T, TResult>
  orWhere<C extends ColumnName<T>>(
    column: C,
    operator: (typeof JsonOperators)[number],
    value: Partial<ColumnValue<T, C>>,
  ): QueryBuilder<T, TResult>
  orWhere<C extends ColumnName<T>>(column: C, value: ColumnValue<T, C>): QueryBuilder<T, TResult>
  orWhere(column: ColumnName<T>, operatorOrValue: unknown, value?: unknown) {
    if (
      typeof value === 'undefined' &&
      !isNormalOperator(operatorOrValue) &&
      operatorOrValue !== 'IS NULL' &&
      operatorOrValue !== 'IS NOT NULL'
    ) {
      this.whereConditions.push({
        kind: 'column',
        type: 'OR',
        column,
        operator: '=',
        value: operatorOrValue,
      })

      return this
    }

    if (!isOperator(operatorOrValue))
      throw new Error(`Invalid operator: ${String(operatorOrValue)}`)

    this.whereConditions.push({
      kind: 'column',
      type: 'OR',
      column,
      operator: operatorOrValue,
      value,
    })

    return this
  }

  /**
   * Adds a raw SQL expression to the WHERE clause with parameter bindings.
   *
   * The SQL fragment is inserted as-is inside parentheses. Use `?` placeholders for
   * values and pass matching `params`; do not interpolate user input into `sql`.
   *
   * @param sql - The raw SQL fragment.
   * @param params - Bound parameters for the SQL fragment.
   */
  whereRaw(sql: string, ...params: any[]) {
    this.whereConditions.push({
      kind: 'raw',
      type: 'AND',
      sql,
      params,
    })

    return this
  }

  /**
   * Adds a raw SQL expression to the WHERE clause using OR with parameter bindings.
   *
   * The SQL fragment is inserted as-is inside parentheses. Use `?` placeholders for
   * values and pass matching `params`; do not interpolate user input into `sql`.
   *
   * @param sql - The raw SQL fragment.
   * @param params - Bound parameters for the SQL fragment.
   */
  orWhereRaw(sql: string, ...params: any[]) {
    this.whereConditions.push({
      kind: 'raw',
      type: 'OR',
      sql,
      params,
    })

    return this
  }

  /**
   * Sets the limit value for the query.
   *
   * The value is bound as a parameter when SQL is generated.
   *
   * @param value - The maximum number of records to retrieve.
   *
   * @example
   * ```ts
   * await query('users').limit(10) // LIMIT 10
   * ```
   */
  limit(value: number) {
    this.limitValue = value
    return this
  }

  /**
   * Sets the offset value for the query.
   *
   * The value is bound as a parameter when SQL is generated.
   *
   * @param value - The number of records to skip.
   *
   * @example
   * ```ts
   * await query('users').offset(10) // OFFSET 10
   * ```
   */
  offset(value: number) {
    this.offsetValue = value
    return this
  }

  /**
   * Sets the order by column and direction for the query.
   *
   * Direction must be one of {@link QueryOrderDirections}; invalid directions throw
   * before SQL is generated.
   *
   * @param column - The column to order by.
   * @param direction - The direction to order by.
   *
   * @example
   * ```ts
   * await query('users').orderBy('id', 'DESC') // ORDER BY id DESC
   * ```
   */
  orderBy<C extends ColumnName<T>>(column: C, direction: QueryOrderDirection = 'ASC') {
    if (!QueryOrderDirections.includes(direction))
      throw Error(`Invalid order direction: ${direction}`)

    this.orderByConditions.push({
      type: 'column',
      column,
      direction,
    })

    return this
  }

  /**
   * Adds a raw SQL expression to ORDER BY with parameter bindings.
   *
   * The SQL fragment is inserted as-is. Use `?` placeholders for values and pass
   * matching `params`; do not interpolate user input into `sql`.
   *
   * @param sql - The raw SQL fragment.
   * @param params - Bound parameters for the SQL fragment.
   */
  orderByRaw(sql: string, ...params: any[]) {
    this.orderByConditions.push({
      type: 'raw',
      sql,
      params,
    })

    return this
  }

  /**
   * Adds an INNER JOIN clause.
   *
   * Join operands are escaped as identifiers unless provided as trusted `RawSql` fragments.
   * The three-argument overload uses `=` as the join operator; the four-argument
   * overload validates that the operator is a normal comparison operator.
   *
   * @param table - The table to join.
   * @param left - The left operand for the ON condition.
   * @param right - Right operand, or the third argument when using the default `=` operator.
   */
  join(
    table: string | RawSql,
    left: string | RawSql,
    right: string | RawSql,
  ): QueryBuilder<T, TResult>
  join(
    table: string | RawSql,
    left: string | RawSql,
    operator: (typeof NormalOperators)[number],
    right: string | RawSql,
  ): QueryBuilder<T, TResult>
  join(
    table: string | RawSql,
    left: string | RawSql,
    operatorOrRight: string | RawSql,
    right?: string | RawSql,
  ) {
    return this.addJoin('INNER', table, left, operatorOrRight, right)
  }

  /**
   * Adds a LEFT JOIN clause.
   *
   * Join operands are escaped as identifiers unless provided as trusted `RawSql` fragments.
   * The three-argument overload uses `=` as the join operator; the four-argument
   * overload validates that the operator is a normal comparison operator.
   *
   * @param table - The table to join.
   * @param left - The left operand for the ON condition.
   * @param right - Right operand, or the third argument when using the default `=` operator.
   */
  leftJoin(
    table: string | RawSql,
    left: string | RawSql,
    right: string | RawSql,
  ): QueryBuilder<T, TResult>
  leftJoin(
    table: string | RawSql,
    left: string | RawSql,
    operator: (typeof NormalOperators)[number],
    right: string | RawSql,
  ): QueryBuilder<T, TResult>
  leftJoin(
    table: string | RawSql,
    left: string | RawSql,
    operatorOrRight: string | RawSql,
    right?: string | RawSql,
  ) {
    return this.addJoin('LEFT', table, left, operatorOrRight, right)
  }

  private addJoin(
    type: 'INNER' | 'LEFT',
    table: string | RawSql,
    left: string | RawSql,
    operatorOrRight: string | RawSql,
    right?: string | RawSql,
  ) {
    if (typeof right === 'undefined') {
      this.joinConditions.push({
        type,
        table,
        left,
        operator: '=',
        right: operatorOrRight as string | RawSql,
      })

      return this
    }

    if (!isNormalOperator(operatorOrRight))
      throw new Error(`Invalid join operator: ${String(operatorOrRight)}`)

    this.joinConditions.push({
      type,
      table,
      left,
      operator: operatorOrRight,
      right,
    })

    return this
  }

  /**
   * Serializes the query builder state into a parameterized SQL statement and bound parameters.
   *
   * The returned SQL uses `?` placeholders. `Client.raw(sql, ...params)` converts
   * those placeholders into `postgres.js` template parameters at execution time.
   *
   * @returns An object containing the generated `sql` string and `params` array.
   */
  toSql() {
    const sql = ['SELECT']
    const params: any[] = []

    // Add columns
    sql.push(
      this.selectColumns
        .map((c) =>
          typeof c === 'string'
            ? escapeIdentifier(c)
            : `jsonb_build_object(${c.fields.map((f) => `'${f as string}', ${escapeIdentifier(c.column as string)}->'${f as string}'`).join(',')}) AS ${escapeIdentifier(c.alias || (c.column as string))}`,
        )
        .join(',') || '*',
    )

    // Add table
    sql.push('FROM', escapeIdentifier(this.table))

    // Add join conditions
    const joinSql = buildJoinSql(this.joinConditions)
    if (joinSql) sql.push(joinSql)

    // Add where conditions
    const { sql: whereSql, params: whereParams } = buildWhereSql(this.whereConditions)
    sql.push(whereSql)
    params.push(...whereParams)

    // Add order by
    if (this.orderByConditions.length > 0) {
      sql.push(
        'ORDER BY',
        this.orderByConditions
          .map((condition) => {
            if (condition.type === 'raw') {
              params.push(...condition.params)
              return condition.sql
            }

            return `${escapeIdentifier(condition.column)} ${condition.direction}`
          })
          .join(','),
      )
    }

    // Add limit and offset
    if (this.limitValue) {
      sql.push('LIMIT ?')
      params.push(this.limitValue)
    }

    if (this.offsetValue) {
      sql.push('OFFSET ?')
      params.push(this.offsetValue)
    }

    return {
      sql: sql.join(' '),
      params,
    }
  }

  /**
   * Makes the QueryBuilder thenable — calling `await builder` implicitly executes the query.
   *
   * This is why `await client.query('users').where('id', id)` returns rows without
   * an explicit `.run()` call.
   *
   * @param onfulfilled - Callback invoked when the query result resolves successfully.
   * @param onrejected - Callback invoked when the query rejects.
   * @returns A promise for the transformed result.
   */
  // eslint-disable-next-line unicorn/no-thenable
  then<TResult1 = TResult, TResult2 = never>(
    onfulfilled?: ((value: TResult) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null,
  ): Promise<TResult1 | TResult2> {
    const { sql, params } = this.toSql()

    return this.client.raw(sql, ...params).then(onfulfilled as any, onrejected)
  }

  /**
   * Executes the query and returns the first matching row, or `null` if no rows match.
   *
   * Automatically applies `LIMIT 1` to the query.
   *
   * @returns The first row of the result set, or `null`.
   */
  async first(): Promise<(TResult extends (infer U)[] ? U : TResult) | null> {
    this.limit(1)

    const { sql, params } = this.toSql()

    return this.client.raw(sql, ...params).then((rows) => rows[0])
  }

  /**
   * Executes a SQL query to count the number of rows in the specified table.
   *
   * @returns {Promise<number>} A promise that resolves to the count of rows in the table.
   *
   * @example
   * ```ts
   * const count = await db('users').count() // => 2
   * ```
   */
  async count() {
    const sql = ['SELECT COUNT(*) AS count']
    const params: any[] = []

    sql.push('FROM', escapeIdentifier(this.table))

    const joinSql = buildJoinSql(this.joinConditions)
    if (joinSql) sql.push(joinSql)

    const { sql: whereSql, params: whereParams } = buildWhereSql(this.whereConditions)
    sql.push(whereSql)
    params.push(...whereParams)

    const result = await this.client.raw(sql.join(' '), ...params)

    return Number.parseInt(result[0].count, 10)
  }

  /**
   * Asynchronously retrieves the values of a specified column from the database.
   *
   * @template C - The type of the column name.
   * @param {C} column - The name of the column to pluck values from.
   * @returns {Promise<ColumnValue<T, C>[]>} A promise that resolves to an array of values from the specified column.
   *
   * @example
   * ```ts
   * const names = await db('users').pluck('name') // => ['Alice', 'Bob']
   * ```
   */
  async pluck<C extends ColumnName<T>>(column: C): Promise<ColumnValue<T, C>[]> {
    this.selectColumns = [column]

    const { sql, params } = this.toSql()
    const result = await this.client.raw(sql, ...params)

    return result.map((row: any) => row[column])
  }

  /**
   * Inserts one or more rows into the table.
   *
   * For multi-row inserts, the keys of the first row define the inserted columns.
   * Values are bound as parameters. Use `returning: ['*']` or explicit columns when
   * inserted rows should be returned.
   *
   * @template FirstValue - The type of the first value to insert, which must be a partial of the table type.
   * @template Returning - The type of the columns to return, which can be an array of keys of the table type or ['*'].
   *
   * @param values - The value or array of values to insert. If an array, the first value is used to determine the columns.
   * @param options - Optional settings for the insert operation.
   * @param options.returning - An array of columns to return, or ['*'] to return all columns.
   *
   * @example
   * ```ts
   * await db('users').insert({ id: 3, name: 'Charlie' }) // => []
   *
   * await db('users').insert({ id: 3, name: 'Charlie' }, { returning: ['name'] }) // => [{ name: 'Charlie' }]
   *
   * await db('users').insert([{ id: 4, name: 'David' }, { id: 5, name: 'Eve' }]) // => []
   * ```
   */
  async insert<
    FirstValue extends Partial<TableType<T>>,
    Returning extends (keyof TableType<T>)[] | ['*'],
  >(
    values:
      | FirstValue
      | [
          FirstValue,
          ...{
            [K in Extract<keyof FirstValue, string | ColumnName<T>>]: ColumnValue<T, K>
          }[],
        ],
    options: { returning?: Returning } = {},
  ): Promise<
    Returning extends ['*']
      ? TableType<T>[]
      : Returning[number] extends keyof TableType<T>
        ? Pick<TableType<T>, Returning[number]>[]
        : Record<string, any>[]
  > {
    const valuesArray = Array.isArray(values) ? values : [values]
    const { sql, params } = buildInsertSql(this.table, valuesArray, options.returning)

    return this.client.raw(sql, ...params) as any
  }

  /**
   * Updates records in the table with the specified values and returns the updated records.
   *
   * Values and WHERE operands are parameterized. A WHERE clause is required to
   * reduce accidental full-table updates.
   *
   * @template Returning - An array of keys of the table type or ['*'] to return all columns.
   * @param {Partial<TableType<T>>} values - The values to update in the table.
   * @param {Object} [options] - Optional settings for the update operation.
   * @param {Returning} [options.returning] - An array of columns to return after the update.
   *
   * @example
   * ```ts
   * await db('users').where('id', 1).update({ name: 'Alice' }) // => []
   *
   * await db('users').where('id', 1).update({ name: 'Alice' }, { returning: ['name'] }) // => [{ name: 'Alice' }]
   * ```
   */
  async update<Returning extends (keyof TableType<T>)[] | ['*']>(
    values: Partial<TableType<T>>,
    options: { returning?: Returning } = {},
  ): Promise<
    Returning extends ['*']
      ? TableType<T>[]
      : Returning[number] extends keyof TableType<T>
        ? Pick<TableType<T>, Returning[number]>[]
        : Record<string, any>[]
  > {
    const { sql: whereSql, params: whereParams } = buildWhereSql(this.whereConditions, 'update')

    if (!whereSql) throw new Error('Missing where conditions')

    const { sql, params } = buildUpdateSql(
      this.table,
      values,
      whereSql,
      whereParams,
      options.returning,
    )

    return this.client.raw(sql, ...params) as any
  }

  /**
   * Atomically updates a JSON/JSONB column using the `||` merge operator,
   * avoiding read-modify-write race conditions.
   *
   * A WHERE clause is required to reduce accidental full-table updates. The merge
   * object is bound as a parameter.
   *
   * @param column - The JSON/JSONB column to update.
   * @param value - The object to merge into the column.
   *
   * @example
   * ```ts
   * await db('users').where('id', 1).updateJson('metadata', { age: 30 })
   * // UPDATE "users" SET "metadata" = "metadata" || '{"age":30}' WHERE "id" = 1
   * ```
   */
  async updateJson<C extends ColumnName<T>>(column: C, value: Partial<ColumnValue<T, C>>) {
    const { sql: whereSql, params: whereParams } = buildWhereSql(this.whereConditions, 'update')

    if (!whereSql) throw new Error('Missing where conditions')

    const { sql, params } = buildUpdateJsonSql(
      this.table,
      column as string,
      value,
      whereSql,
      whereParams,
    )

    return this.client.raw(sql, ...params)
  }

  /**
   * Deletes records from the specified table based on the provided where conditions.
   *
   * A WHERE clause is required to reduce accidental full-table deletes.
   *
   * @throws {Error} If no where conditions are provided.
   * @returns {Promise<any>} The result of the raw SQL execution.
   *
   * @example
   * ```ts
   * await db('users').where('id', 1).delete() // DELETE FROM users WHERE id = 1
   * ```
   */
  async delete() {
    const { sql: whereSql, params: whereParams } = buildWhereSql(this.whereConditions)

    if (!whereSql) throw new Error('Missing where conditions')

    const { sql, params } = buildDeleteSql(this.table, whereSql, whereParams)

    return this.client.raw(sql, ...params)
  }

  /**
   * Inserts or updates records in the database table.
   *
   * Values are parameterized. Conflict and returning columns are escaped as identifiers,
   * and omitted `update` defaults to every non-conflict column from the first row.
   *
   * @template FirstValue - A partial type of the table's row type.
   *
   * @param {FirstValue | [FirstValue, ...{ [K in Extract<keyof FirstValue, string | ColumnName<T>>]: ColumnValue<T, K> }[]]} values - The values to insert or update. Can be a single object or an array of objects.
   * @param {Object} options - The options for the upsert operation.
   * @param {ColumnName<T>[]} options.conflict - The columns to check for conflicts.
   * @param {(keyof FirstValue)[]} [options.update] - The columns to update if a conflict occurs.
   * @param {(keyof FirstValue)[] | ['*']} [options.returning] - The columns to return after the upsert operation.
   *
   * @returns {Promise<any>} - A promise that resolves to the result of the upsert operation.
   *
   * @example
   * ```ts
   * await db('users').upsert({ id: 1, name: 'Alice' }, { conflict: ['id'], update: ['name'] }) // => []
   * ```
   */
  async upsert<
    FirstValue extends Partial<TableType<T>>,
    Returning extends (keyof FirstValue)[] | ['*'],
  >(
    values:
      | FirstValue
      | [
          FirstValue,
          ...{
            [K in Extract<keyof FirstValue, string | ColumnName<T>>]: ColumnValue<T, K>
          }[],
        ],
    options: {
      conflict: ColumnName<T>[]
      update?: (keyof FirstValue)[]
      returning?: Returning
    },
  ): Promise<
    Returning extends ['*']
      ? TableType<T>[]
      : Returning[number] extends keyof TableType<T>
        ? Pick<TableType<T>, Returning[number]>[]
        : Record<string, any>[]
  > {
    const valuesArray = Array.isArray(values) ? values : [values]
    const { sql, params } = buildUpsertSql(
      this.table,
      valuesArray,
      options.conflict as string[],
      options.update as string[],
      options.returning as (keyof any)[] | ['*'],
    )

    return this.client.raw(sql, ...params) as any
  }
}
