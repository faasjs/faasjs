import { escapeIdentifier } from '@faasjs/pg'
import type { Sql } from 'postgres'

function shouldExcludeTable(schema: string, table: string, excludedTables: Set<string>) {
  return excludedTables.has(table) || excludedTables.has(`${schema}.${table}`)
}

/**
 * Resets the current testing database by truncating tables in the `public` schema.
 *
 * @param {Sql<T>} sql - `postgres.js` client connected to the testing database.
 * @param {string[]} [excludeTables] - Tables that should be preserved during the reset.
 * @returns Promise that resolves when the reset completes.
 */
export async function resetTestingDatabase<T extends Record<string, unknown> = {}>(
  sql: Sql<T>,
  excludeTables: string[] = [],
) {
  const excludedTableNames = new Set(excludeTables)
  const tables = (
    await sql.unsafe<{ schemaname: string; tablename: string }[]>(
      `
        SELECT schemaname, tablename
        FROM pg_tables
        WHERE schemaname = 'public'
        ORDER BY schemaname, tablename
      `,
    )
  )
    .filter((table) => !shouldExcludeTable(table.schemaname, table.tablename, excludedTableNames))
    .map((table) => escapeIdentifier(`${table.schemaname}.${table.tablename}`))

  if (!tables.length) return

  await sql.unsafe(`TRUNCATE TABLE ${tables.join(', ')} RESTART IDENTITY CASCADE`)
}
