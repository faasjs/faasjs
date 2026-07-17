import { escapeIdentifier, escapeValue } from '../utils'

/**
 * Supported PostgreSQL column types for schema definitions.
 */
type ColumnType =
  | 'smallint'
  | 'integer'
  | 'bigint'
  | 'decimal'
  | 'numeric'
  | 'real'
  | 'double precision'
  | `decimal(${number},${number})`
  | `numeric(${number},${number})`
  | 'varchar'
  | 'char'
  | 'text'
  | `varchar(${number})`
  | `char(${number})`
  | 'boolean'
  | 'date'
  | 'time'
  | 'timestamp'
  | 'timestamptz'
  | 'interval'
  | 'json'
  | 'jsonb'
  | 'uuid'
  | 'bytea'
  | 'inet'
  | 'cidr'
  | 'macaddr'
  | 'point'
  | 'line'
  | 'box'
  | 'circle'

/**
 * Definition for a single column within a table schema.
 */
type ColumnDefinition = {
  type: ColumnType
  nullable?: boolean
  defaultValue?: string | number | boolean | null
  primary?: boolean
  unique?: boolean
  check?: string
  references?: {
    table: string
    column: string
    onDelete?: 'CASCADE' | 'SET NULL' | 'SET DEFAULT' | 'RESTRICT' | 'NO ACTION'
    onUpdate?: 'CASCADE' | 'SET NULL' | 'SET DEFAULT' | 'RESTRICT' | 'NO ACTION'
  }
  collate?: string
}

/**
 * Describes a single ALTER TABLE operation (rename, drop, modify column, or drop index).
 */
type AlterOperation =
  | {
      type: 'renameColumn'
      from: string
      to: string
    }
  | {
      type: 'dropColumn'
      name: string
    }
  | {
      type: 'alterColumn'
      name: string
      changes: Partial<ColumnDefinition>
    }
  | {
      type: 'dropIndex'
      name: string
    }

export type TableBuilderMode = 'create' | 'alter'

type IndexType = 'btree' | 'hash' | 'gist' | 'gin' | 'spgist' | 'brin'

/**
 * Index descriptor used to generate CREATE INDEX / UNIQUE INDEX statements.
 */
export type IndexDefs = {
  columns: string[]
  unique?: boolean
  indexType?: IndexType
}

/**
 * Builder for table schema definitions, supporting both CREATE and ALTER TABLE modes.
 *
 * Column definitions and alterations are accumulated and then serialized to SQL
 * via {@link toSQL}. Generated identifiers are escaped; raw SQL added with {@link raw}
 * is emitted unchanged and should only contain trusted schema text.
 */
export class TableBuilder {
  private tableName: string
  private mode: TableBuilderMode
  private columns: Map<string, ColumnDefinition> = new Map()
  private indices: Map<string, IndexDefs> = new Map()
  private operations: AlterOperation[] = []
  private raws: string[] = []

  /**
   * @param tableName - The name of the table.
   * @param mode - Whether to produce CREATE TABLE or ALTER TABLE statements.
   */
  constructor(tableName: string, mode: TableBuilderMode) {
    this.tableName = tableName
    this.mode = mode
  }

  /**
   * Defines a column with an explicit PostgreSQL type.
   *
   * Use this for types not covered by the convenience helpers, such as arrays or
   * extension-provided types.
   *
   * @param name - The column name.
   * @param type - The PostgreSQL type string (e.g. `'integer'`, `'varchar(255)'`).
   */
  specificType(name: string, type: string) {
    return this.column(name, type as ColumnType)
  }

  /**
   * Defines a `varchar` column, optionally with a maximum length.
   *
   * @param name - The column name.
   * @param length - Optional maximum length.
   */
  string(name: string, length?: number) {
    return this.column(name, length ? `varchar(${length})` : 'varchar')
  }

  /**
   * Defines an `integer` column, or `decimal(precision, scale)` if precision is provided.
   *
   * When `precision` is provided and `scale` is omitted, the scale defaults to `0`.
   *
   * @param name - The column name.
   * @param precision - Optional decimal precision.
   * @param scale - Optional decimal scale.
   */
  number(name: string, precision?: number, scale?: number) {
    return this.column(name, precision ? `decimal(${precision},${scale || 0})` : 'integer')
  }

  /**
   * Defines a `boolean` column.
   *
   * @param name - The column name.
   */
  boolean(name: string) {
    return this.column(name, 'boolean')
  }

  /**
   * Defines a `date` column.
   *
   * @param name - The column name.
   */
  date(name: string) {
    return this.column(name, 'date')
  }

  /**
   * Defines a `json` column.
   *
   * @param name - The column name.
   */
  json(name: string) {
    return this.column(name, 'json')
  }

  /**
   * Defines a `jsonb` column.
   *
   * @param name - The column name.
   */
  jsonb(name: string) {
    return this.column(name, 'jsonb')
  }

  /**
   * Defines a `timestamp` column (without timezone).
   *
   * @param name - The column name.
   */
  timestamp(name: string) {
    return this.column(name, 'timestamp')
  }

  /**
   * Defines a `timestamptz` column (with timezone).
   *
   * @param name - The column name.
   */
  timestamptz(name: string) {
    return this.column(name, 'timestamptz')
  }

  /**
   * Adds `created_at` and `updated_at` `timestamptz` columns with a default of `now()`.
   */
  timestamps() {
    this.timestamptz('created_at').defaultTo('now()')
    this.timestamptz('updated_at').defaultTo('now()')

    return this
  }

  private column(name: string, type: ColumnType) {
    const column: ColumnDefinition = { type }
    this.columns.set(name, column)
    return new ColumnBuilder(column)
  }

  /**
   * Renames a column. In `create` mode this renames it in the pending definition.
   * In `alter` mode this stages a RENAME COLUMN operation.
   *
   * @param from - The current column name.
   * @param to - The new column name.
   */
  renameColumn(from: string, to: string) {
    const column = this.columns.get(from)

    if (!column) {
      if (this.mode === 'create')
        throw Error(`renameColumn failed: Column "${from}" does not exist`)

      this.operations.push({
        type: 'renameColumn',
        from,
        to,
      })

      return this
    }

    this.columns.delete(from)
    this.columns.set(to, column)

    return this
  }

  /**
   * Drops a column. In `create` mode this removes it from the pending definition.
   * In `alter` mode this stages a DROP COLUMN operation.
   *
   * @param name - The column name to drop.
   */
  dropColumn(name: string) {
    this.columns.delete(name)

    if (this.mode === 'create') return this

    this.operations.push({
      type: 'dropColumn',
      name,
    })

    return this
  }

  /**
   * Alters an existing column. In `create` mode this mutates the pending definition.
   * In `alter` mode this stages ALTER COLUMN operations.
   *
   * @param name - The column name to alter.
   * @param changes - The partial column definition with changes to apply.
   */
  alterColumn(name: string, changes: Partial<ColumnDefinition>) {
    const column = this.columns.get(name)

    if (!column) {
      if (this.mode === 'create') throw Error(`alterColumn failed: Column "${name}" does not exist`)

      this.operations.push({
        type: 'alterColumn',
        name,
        changes,
      })

      return this
    }

    this.columns.set(name, { ...column, ...changes })

    return this
  }

  /**
   * Creates an index on one or more columns. The index name is auto-generated as
   * `idx_{tableName}_{columns}`.
   *
   * Reusing the same generated name replaces the pending in-memory index definition.
   *
   * @param columns - Single column name or array of column names.
   * @param options - Index options such as `unique` and `indexType`.
   */
  index(columns: string | string[], options: Omit<IndexDefs, 'columns'> = {}) {
    const name = `idx_${this.tableName}_${Array.isArray(columns) ? columns.join('_') : columns}`

    this.indices.set(name, {
      columns: Array.isArray(columns) ? columns : [columns],
      ...options,
    })

    return this
  }

  /**
   * Drops an index previously defined by {@link index}. The index name must match
   * the auto-generated naming convention `idx_{tableName}_{columns}`.
   *
   * @param columns - The same column(s) originally passed to {@link index}.
   */
  dropIndex(columns: string | string[]) {
    const name = `idx_${this.tableName}_${Array.isArray(columns) ? columns.join('_') : columns}`

    if (this.indices.has(name)) {
      this.indices.delete(name)
      return this
    }

    if (this.mode === 'create') throw Error(`dropIndex failed: Index "${name}" does not exist`)

    this.operations.push({
      type: 'dropIndex',
      name,
    })
  }

  /**
   * Appends a raw SQL fragment to the generated output.
   *
   * The fragment is emitted unchanged after generated table and index SQL. Only pass
   * static, trusted schema SQL.
   *
   * @param sql - The raw SQL to include.
   */
  raw(sql: string) {
    this.raws.push(sql)

    return this
  }

  /**
   * Serializes the table builder state into an array of SQL statement strings.
   *
   * @returns The generated SQL statements.
   */
  toSQL(): string[] {
    const sql: string[] = []
    const columnDefs = Array.from(this.columns.entries()).map(([name, def]) =>
      this.columnToSQL(name, def),
    )

    switch (this.mode) {
      case 'create':
        sql.push(
          `CREATE TABLE ${escapeIdentifier(this.tableName)} (\n${columnDefs.join(',\n')}\n);\n`,
        )
        break
      case 'alter':
        sql.push(
          ...columnDefs.map(
            (c) => `ALTER TABLE ${escapeIdentifier(this.tableName)} ADD COLUMN ${c};`,
          ),
        )

        for (const operation of this.operations) {
          switch (operation.type) {
            case 'renameColumn':
              sql.push(
                `ALTER TABLE ${escapeIdentifier(this.tableName)} ` +
                  `RENAME COLUMN ${escapeIdentifier(operation.from)} TO ${escapeIdentifier(operation.to)};\n`,
              )
              break
            case 'dropColumn':
              sql.push(
                `ALTER TABLE ${escapeIdentifier(this.tableName)} ` +
                  `DROP COLUMN "${operation.name}";\n`,
              )
              break
            case 'alterColumn':
              sql.push(
                ...Object.entries(operation.changes).map(
                  ([key, value]) =>
                    `ALTER TABLE ${escapeIdentifier(this.tableName)} ${this.alterToSql(operation.name, key as keyof ColumnDefinition, value)};`,
                ),
              )
              break
            case 'dropIndex':
              sql.push(`DROP INDEX IF EXISTS ${escapeIdentifier(operation.name)};`)
              break
          }
        }
        break
    }

    const indexDefs = Array.from(this.indices.entries()).map(([name, definition]) =>
      this.indexToSQL(name, definition),
    )

    sql.push(indexDefs.join('\n'))

    sql.push(...this.raws)

    return sql
  }

  private columnToSQL(name: string, def: ColumnDefinition): string {
    const parts = [
      escapeIdentifier(name),
      def.type,
      def.nullable ? 'NULL' : 'NOT NULL',
      def.defaultValue !== undefined
        ? `DEFAULT ${escapeValue(def.defaultValue)}::${def.type}`
        : null,
      def.primary ? 'PRIMARY KEY' : null,
      def.unique ? 'UNIQUE' : null,
      def.references ? `REFERENCES ${def.references.table}(${def.references.column})` : null,
    ].filter(Boolean)

    return parts.join(' ')
  }

  private indexToSQL(name: string, defs: IndexDefs): string {
    const parts = [
      'CREATE',
      defs.unique ? 'UNIQUE' : '',
      'INDEX',
      escapeIdentifier(name),
      'ON',
      escapeIdentifier(this.tableName),
      defs.indexType ? `USING ${defs.indexType}` : '',
      `(${defs.columns.map(escapeIdentifier).join(', ')});`,
    ].filter(Boolean)

    return parts.join(' ')
  }

  private alterToSql(columnName: string, type: keyof ColumnDefinition, value: any) {
    switch (type) {
      case 'type':
        return `ALTER COLUMN ${escapeIdentifier(columnName)} SET DATA TYPE ${value};`
      case 'nullable':
        return `ALTER COLUMN ${escapeIdentifier(columnName)} ${value ? 'DROP' : 'SET'} NOT NULL;`
      case 'defaultValue':
        return `ALTER COLUMN ${escapeIdentifier(columnName)} SET DEFAULT ${escapeValue(value)};`
      case 'primary':
        return value
          ? `ADD PRIMARY KEY (${escapeIdentifier(columnName)})`
          : `DROP CONSTRAINT IF EXISTS ${escapeIdentifier(`${this.tableName}_pkey`)};`
      case 'unique':
        return value
          ? `ADD UNIQUE (${escapeIdentifier(columnName)})`
          : `DROP CONSTRAINT IF EXISTS ${escapeIdentifier(`${this.tableName}_${columnName}_unique`)};`
      case 'check':
        return `ADD CHECK (${value});`
      case 'references':
        return `ALTER COLUMN ${escapeIdentifier(columnName)} ADD REFERENCES ${value.table}(${value.column});`
      case 'collate':
        return `ALTER COLUMN ${escapeIdentifier(columnName)} SET COLLATE ${value};`
    }
  }
}

/**
 * Fluent builder for configuring a single column definition.
 */
class ColumnBuilder {
  private definition: ColumnDefinition

  constructor(definition: ColumnDefinition) {
    this.definition = definition
  }

  /**
   * Sets whether the column is nullable.
   *
   * @param isNullable - Defaults to `true`.
   */
  nullable(isNullable = true) {
    this.definition.nullable = isNullable
    return this
  }

  /**
   * Sets the default value for the column.
   *
   * @param value - The default value. Pass `'now()'` for timestamp defaults.
   */
  defaultTo(value: any) {
    this.definition.defaultValue = value
    return this
  }

  /**
   * Marks the column as a primary key.
   */
  primary() {
    this.definition.primary = true
    return this
  }

  /**
   * Adds a UNIQUE constraint to the column.
   */
  unique() {
    this.definition.unique = true
    return this
  }

  /**
   * Adds a foreign key reference to the column.
   *
   * @param table - The referenced table name.
   * @param column - The referenced column name.
   */
  references(table: string, column: string) {
    this.definition.references = { table, column }
    return this
  }
}
