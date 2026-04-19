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

  constructor(client: Client) {
    this.client = client
  }

  createTable(tableName: string, callback: (table: TableBuilder) => void) {
    const builder = new TableBuilder(tableName, 'create')
    callback(builder)
    this.changes.push(builder)
    return this
  }

  alterTable(tableName: string, callback: (table: TableBuilder) => void) {
    const builder = new TableBuilder(tableName, 'alter')
    callback(builder)
    this.changes.push(builder)
    return this
  }

  renameTable(oldTableName: string, newTableName: string) {
    this.changes.push(
      `alter table ${escapeIdentifier(oldTableName)} rename to ${escapeIdentifier(newTableName)};`,
    )
    return this
  }

  dropTable(tableName: string) {
    this.changes.push(`drop table ${escapeIdentifier(tableName)};`)
    return this
  }

  raw(sql: string) {
    this.changes.push(sql)
    return this
  }

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
