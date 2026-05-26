import type { Client } from '../client'
import { escapeIdentifier } from '../utils'
import { TableBuilder } from './table-builder'

export { TableBuilder } from './table-builder'

/**
 * Builds and executes schema changes against a {@link Client}.
 *
 * Accumulated statements are executed in a single transaction by {@link run}.
 */
export class SchemaBuilder {
  private client: Client
  private changes: (string | TableBuilder)[] = []

  /**
   * @param client - The database client used to execute schema changes.
   */
  constructor(client: Client) {
    this.client = client
  }

  /**
   * Registers a CREATE TABLE statement. The callback receives a {@link TableBuilder}
   * scoped to the given table name in create mode.
   *
   * @param tableName - The name of the table to create.
   * @param callback - A function that defines the table schema.
   */
  createTable(tableName: string, callback: (table: TableBuilder) => void) {
    const builder = new TableBuilder(tableName, 'create')
    callback(builder)
    this.changes.push(builder)
    return this
  }

  /**
   * Registers one or more ALTER TABLE statements. The callback receives a {@link TableBuilder}
   * scoped to the given table name in alter mode.
   *
   * @param tableName - The name of the table to alter.
   * @param callback - A function that defines the alterations.
   */
  alterTable(tableName: string, callback: (table: TableBuilder) => void) {
    const builder = new TableBuilder(tableName, 'alter')
    callback(builder)
    this.changes.push(builder)
    return this
  }

  /**
   * Registers a table rename statement.
   *
   * @param oldTableName - The current table name.
   * @param newTableName - The new table name.
   */
  renameTable(oldTableName: string, newTableName: string) {
    this.changes.push(
      `alter table ${escapeIdentifier(oldTableName)} rename to ${escapeIdentifier(newTableName)};`,
    )
    return this
  }

  /**
   * Registers a DROP TABLE statement.
   *
   * @param tableName - The name of the table to drop.
   */
  dropTable(tableName: string) {
    this.changes.push(`drop table ${escapeIdentifier(tableName)};`)
    return this
  }

  /**
   * Appends a raw SQL statement to the change list.
   *
   * @param sql - The raw SQL to execute.
   */
  raw(sql: string) {
    this.changes.push(sql)
    return this
  }

  /**
   * Serializes all registered schema changes into an array of SQL statement strings.
   *
   * @returns The array of generated SQL statements.
   */
  toSQL(): string[] {
    const statements: string[] = []

    for (const builder of this.changes) {
      if (typeof builder === 'string') {
        statements.push(builder)
      } else {
        statements.push(...builder.toSQL())
      }
    }

    return statements
  }

  /**
   * Executes all registered schema changes in a single database transaction.
   *
   * @throws {Error} Wrapped with the full SQL on failure.
   */
  async run() {
    const statements = this.toSQL()
      .map((statement) => statement.trim())
      .filter(Boolean)

    if (!statements.length) return

    const sql = statements.join('\n')

    try {
      await this.client.transaction(async (client) => {
        for (const statement of statements) {
          await client.raw(statement)
        }
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      throw new Error(`${message}\n\nSQL: ${sql}`)
    }

    this.changes = []
  }
}
