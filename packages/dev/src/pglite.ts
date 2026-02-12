import { readFileSync } from 'node:fs'
import { type Knex, knex } from 'knex'
import PgliteDialect from 'knex-pglite'

type FaasKnexGlobal = {
  FaasJS_Knex?: Record<
    string,
    {
      adapter: Knex
      query: Knex
      config: Record<string, unknown>
    }
  >
}

export type MountFaasKnexOptions = {
  /** key of `globalThis.FaasJS_Knex`, default is `knex` */
  name?: string
  /** optional config metadata passed through to `@faasjs/knex` */
  config?: Record<string, unknown>
}

/**
 * Create a knex instance backed by `knex-pglite`.
 */
export function createPgliteKnex(
  config: Partial<Knex.Config> = {},
  connection: Record<string, unknown> = {}
): Knex {
  return knex({
    ...config,
    client: PgliteDialect,
    connection,
  })
}

/**
 * Mount a knex adapter to `globalThis.FaasJS_Knex` for `@faasjs/knex`.
 */
export function mountFaasKnex(
  db: Knex,
  options: MountFaasKnexOptions = {}
): void {
  const globalWithFaasKnex = globalThis as typeof globalThis & FaasKnexGlobal
  const name = options.name || 'knex'

  if (!globalWithFaasKnex.FaasJS_Knex) globalWithFaasKnex.FaasJS_Knex = {}

  globalWithFaasKnex.FaasJS_Knex[name] = {
    adapter: db,
    query: db,
    config: options.config || {},
  }
}

/**
 * Remove mounted knex adapter from `globalThis.FaasJS_Knex`.
 */
export function unmountFaasKnex(name = 'knex'): void {
  const globalWithFaasKnex = globalThis as typeof globalThis & FaasKnexGlobal

  if (!globalWithFaasKnex.FaasJS_Knex) return

  delete globalWithFaasKnex.FaasJS_Knex[name]
}

/**
 * Run a SQL string on a PGlite-backed knex instance.
 */
export async function runPgliteSql(db: Knex, sql: string): Promise<void> {
  if (!sql.trim()) return

  await db.raw(sql)
}

/**
 * Run SQL from file on a PGlite-backed knex instance.
 */
export async function runPgliteSqlFile(
  db: Knex,
  filePath: string,
  options: {
    stripUuidOsspExtension?: boolean
  } = {}
): Promise<void> {
  const stripUuidOsspExtension = options.stripUuidOsspExtension !== false

  let sql = readFileSync(filePath, 'utf8')

  if (stripUuidOsspExtension)
    sql = sql.replace(/CREATE EXTENSION IF NOT EXISTS "uuid-ossp";\s*/gi, '')

  await runPgliteSql(db, sql)
}
