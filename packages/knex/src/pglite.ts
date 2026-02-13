import { randomUUID } from 'node:crypto'
import { mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { loadPackage } from '@faasjs/load'
import knex, { type Knex as OriginKnex } from 'knex'

type PGliteModule = typeof import('@electric-sql/pglite')

type FaasKnexGlobal = {
  FaasJS_Knex?: Record<string, MountedKnexAdapter>
}

export type MountedKnexAdapter = {
  adapter: OriginKnex
  query: OriginKnex
  config: Record<string, unknown>
}

export type MountFaasKnexOptions = {
  /** key of `globalThis.FaasJS_Knex`, default is `knex` */
  name?: string
  /** optional config metadata passed through to `@faasjs/knex` */
  config?: Record<string, unknown>
}

function parsePgliteConnection(connection: unknown): string {
  if (typeof connection === 'undefined' || connection === null)
    return `memory://${randomUUID()}`

  if (typeof connection !== 'string' || !connection.trim().length)
    throw Error(
      '[Knex] Invalid "pglite" connection, expected non-empty string in config.connection or SECRET_<NAME>_CONNECTION.'
    )

  return connection
}

function ensurePgliteConnectionPath(connection: string): void {
  // URI-style connections (e.g. memory://) do not map to local directories.
  if (connection.includes('://')) return

  mkdirSync(dirname(resolve(connection)), { recursive: true })
}

async function loadPglitePackages(): Promise<{
  PGlite: PGliteModule['PGlite']
  types: PGliteModule['types']
  PgliteDialect: unknown
}> {
  try {
    const pgliteModule = await loadPackage<PGliteModule>(
      '@electric-sql/pglite',
      []
    )
    const PgliteDialect = await loadPackage<unknown>('knex-pglite')

    if (typeof pgliteModule.PGlite !== 'function' || !pgliteModule.types)
      throw Error('Invalid @electric-sql/pglite exports')

    if (typeof PgliteDialect !== 'function')
      throw Error('Invalid knex-pglite exports')

    return {
      PGlite: pgliteModule.PGlite,
      types: pgliteModule.types,
      PgliteDialect,
    }
  } catch {
    throw Error(
      '[Knex] client "pglite" requires dependencies "@electric-sql/pglite" and "knex-pglite". Please install both packages in your project.'
    )
  }
}

/**
 * Create a knex instance backed by `knex-pglite`.
 * If connection is missing, it defaults to an in-memory database.
 */
export async function createPgliteKnex(
  config: Partial<OriginKnex.Config> = {},
  connection?: string
): Promise<OriginKnex> {
  const resolvedConnection = parsePgliteConnection(
    connection ?? config.connection
  )
  ensurePgliteConnectionPath(resolvedConnection)

  const { PGlite, types, PgliteDialect } = await loadPglitePackages()

  const {
    client: _client,
    connection: _connection,
    pool: _pool,
    ...restConfig
  } = config

  const postgresTypeParsers: Record<number, (v: string) => number> = {
    [types.INT2]: (v: string) => Number.parseInt(v, 10),
    [types.INT4]: (v: string) => Number.parseInt(v, 10),
    [types.INT8]: (v: string) => Number.parseInt(v, 10),
    [types.FLOAT4]: (v: string) => Number.parseFloat(v),
    [types.FLOAT8]: (v: string) => Number.parseFloat(v),
    [types.NUMERIC]: (v: string) => Number.parseFloat(v),
  }

  const pglite = new PGlite(resolvedConnection, {
    parsers: postgresTypeParsers,
  })

  return knex({
    ...restConfig,
    client: PgliteDialect as OriginKnex.Config['client'],
    connection: {
      pglite,
    } as OriginKnex.StaticConnectionConfig,
  })
}

/**
 * Mount a knex adapter to `globalThis.FaasJS_Knex` for `@faasjs/knex`.
 */
export function mountFaasKnex(
  db: OriginKnex,
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
