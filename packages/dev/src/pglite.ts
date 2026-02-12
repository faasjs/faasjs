import { PGlite, types } from '@electric-sql/pglite'
import knex, { type Knex } from 'knex'
import PgliteDialect from 'knex-pglite'

const postgresTypeParsers: Record<number, (v: string) => number> = {
  [types.INT2]: (v: string) => Number.parseInt(v, 10),
  [types.INT4]: (v: string) => Number.parseInt(v, 10),
  [types.INT8]: (v: string) => Number.parseInt(v, 10),
  [types.FLOAT4]: (v: string) => Number.parseFloat(v),
  [types.FLOAT8]: (v: string) => Number.parseFloat(v),
  [types.NUMERIC]: (v: string) => Number.parseFloat(v),
}

type PgliteConnection = Record<string, unknown> & {
  filename?: string
  connectionString?: string
}

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
  const pgliteConnection = connection as PgliteConnection
  const dataDir =
    typeof pgliteConnection.filename === 'string'
      ? pgliteConnection.filename
      : typeof pgliteConnection.connectionString === 'string'
        ? pgliteConnection.connectionString
        : undefined

  const pglite = new PGlite({
    ...(dataDir ? { dataDir } : {}),
    parsers: postgresTypeParsers,
  })

  // Always use parser-configured instance to align with @faasjs/knex pg parsing.
  const pgliteKnexConnection = {
    ...connection,
    pglite,
  } as Knex.StaticConnectionConfig

  return knex({
    ...config,
    client: PgliteDialect,
    connection: pgliteKnexConnection,
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
