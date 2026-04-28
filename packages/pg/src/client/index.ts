import { randomUUID } from 'node:crypto'

import { Logger } from '@faasjs/node-utils'
import postgres, { type PostgresType, type Sql } from 'postgres'

import { resolveDatabaseBootstrap } from '../bootstrap'
import { QueryBuilder } from '../query-builder'
import type { TableName } from '../types'
import { createTemplateStringsArray } from '../utils'

export type ClientOptions<T extends Record<string, PostgresType> = Record<string, never>> =
  postgres.Options<T>

type PostgresTypes = Record<string, PostgresType>
type AnyClientOptions = ClientOptions<PostgresTypes>

const DEFAULT_POOL_MAX = 10
const PG_POOL_MAX_ENV_NAME = 'PG_POOL_MAX'
const clients = new Map<string, Client>()

function resolvePoolMax() {
  const configuredPoolMax = process.env[PG_POOL_MAX_ENV_NAME]?.trim()

  if (!configuredPoolMax) return DEFAULT_POOL_MAX

  if (!/^[1-9]\d*$/.test(configuredPoolMax)) {
    throw new Error(`${PG_POOL_MAX_ENV_NAME} must be a positive integer`)
  }

  const poolMax = Number(configuredPoolMax)

  if (!Number.isSafeInteger(poolMax)) {
    throw new Error(`${PG_POOL_MAX_ENV_NAME} must be a positive integer`)
  }

  return poolMax
}

function resolveClientOptions(options?: AnyClientOptions): AnyClientOptions {
  if (typeof options?.max === 'number') return options

  return {
    ...options,
    max: resolvePoolMax(),
  }
}

export class Client {
  readonly postgres: Sql
  readonly options: ClientOptions<Record<string, PostgresType>>
  readonly logger: Logger
  private url: string

  constructor(url: string, options?: AnyClientOptions) {
    if (typeof url !== 'string') {
      throw new TypeError('Client constructor only accepts a connection URL and optional options')
    }

    const resolvedOptions = resolveClientOptions(options)

    this.postgres = postgres(url, resolvedOptions)
    this.options = resolvedOptions
    this.logger = new Logger('@faasjs/pg')

    this.url = url
    clients.set(url, this)
  }

  /**
   * Initiates a query builder for the specified table.
   *
   * @template T - The type of the table name.
   * @param {T} table - The name of the table to query.
   * @returns {QueryBuilder<T>} A new instance of the QueryBuilder for the specified table.
   *
   * @example
   * ```ts
   * const users = await client.query('users').where('id', userId)
   * ```
   */
  query<T extends TableName>(table: T): QueryBuilder<T> {
    return new QueryBuilder<T>(this, table)
  }

  /**
   * Executes a function within a database transaction.
   *
   * @template T - The type of the result returned by the transaction function.
   * @param {function(Client): Promise<T>} fn - A function that takes a `Client` instance and returns a promise.
   * @returns {Promise<T>} - A promise that resolves to the result of the transaction function.
   *
   * @example
   * ```ts
   * const result = await client.transaction(async (trx) => {
   *   return await trx.query('users').insert({ name: 'Alice' })
   * })
   * ```
   */
  async transaction<T>(fn: (client: Client) => Promise<T>) {
    return this.postgres.begin(async (sql) => {
      const client = Object.create(Client.prototype)

      Object.defineProperties(client, {
        postgres: {
          value: sql,
          enumerable: true,
        },
        options: {
          value: this.options,
          enumerable: true,
        },
        logger: {
          value: this.logger,
          enumerable: true,
        },
      })

      return fn(client)
    })
  }

  /**
   * Executes a raw SQL query and returns the result as an array of objects.
   *
   * @template T - The type of the result objects. Defaults to `Record<string, any>`.
   * @param {string | TemplateStringsArray} query - The SQL query to execute. Can be a string or a template string array.
   * @param {...any[]} params - The parameters to pass to the SQL query.
   * @returns {Promise<T[]>} A promise that resolves to an array of objects of type `T`.
   *
   * @example
   * ```ts
   * // using a template string array
   * const users = await client.raw<User>`SELECT * FROM users`
   * // using a string
   * const users = await client.raw<User>('SELECT * FROM users')
   * // template string array with parameters
   * const users = await client.raw<User>`SELECT * FROM users WHERE id = ${userId}`
   * // string with parameters
   * const users = await client.raw<User>('SELECT * FROM users WHERE id = ?', userId)
   * ```
   */
  async raw<T extends Record<string, any> = any>(
    query: string | TemplateStringsArray,
    ...params: any[]
  ): Promise<T[]> {
    const templateStringsArray = createTemplateStringsArray(query)

    if (this.logger.level !== 'debug') return this.postgres<T[]>(templateStringsArray, ...params)

    const id = randomUUID()
    this.logger.time(id)
    try {
      const result = await this.postgres<T[]>(templateStringsArray, ...params)
      this.logger.timeEnd(id, '%s %j', templateStringsArray.raw.join('?'), params)
      return result
    } catch (error: any) {
      this.logger.timeEnd(id, '%s %j', templateStringsArray.raw.join('?'), params)
      this.logger.error(error)
      throw error
    }
  }

  async quit() {
    try {
      await this.postgres.end()
    } finally {
      if (clients.get(this.url) === this) {
        clients.delete(this.url)
      }
    }
  }
}

/**
 * Creates a new instance of the `Client` class from a PostgreSQL connection string.
 *
 * @param url - The PostgreSQL connection string.
 * @param options - Optional `postgres.js` options. When `options.max` is omitted,
 * the default pool size is read from `process.env.PG_POOL_MAX` and falls
 * back to `10`.
 * @returns A new `Client` instance.
 *
 * @example
 * ```ts
 * import { createClient } from '@faasjs/pg'
 *
 * const client = createClient('postgres://user:pass@localhost:5432/db')
 * ```
 */
export function createClient<T extends Record<string, PostgresType> = Record<string, never>>(
  url: string,
  options?: ClientOptions<T>,
): Client {
  return new Client(url, options)
}

function getOnlyCachedClient() {
  if (clients.size === 1) {
    const client = clients.values().next().value

    if (client) return client

    throw new Error('Expected exactly one cached client')
  }

  if (clients.size !== 0) {
    throw new Error('getClient() requires a connection URL when multiple clients are cached')
  }
}

/**
 * Returns a cached client created by {@link createClient}.
 *
 * When `url` is omitted and the cache contains exactly one client, that client
 * is returned. When the cache is empty, the registered async database bootstrap
 * is awaited to initialize the default client. The built-in bootstrap creates
 * that client from `process.env.DATABASE_URL`, while callers such as
 * `@faasjs/pg-dev` can override it for lazy test setup. Throws when no client
 * can be resolved.
 *
 * @throws {Error} When the requested URL is not cached.
 * @throws {Error} When multiple cached clients exist and `url` is omitted.
 * @throws {Error} When the registered database bootstrap does not initialize exactly one default client.
 *
 * @example
 * ```ts
 * import { getClient } from '@faasjs/pg'
 *
 * const client = await getClient()
 * const users = await client.query('users')
 * ```
 */
export async function getClient(url?: string): Promise<Client> {
  if (url) {
    const client = clients.get(url)

    if (client) return client

    throw new Error(`No cached client found for connection URL: ${url}`)
  }

  const cachedClient = getOnlyCachedClient()

  if (cachedClient) return cachedClient

  await resolveDatabaseBootstrap()

  const bootstrappedClient = getOnlyCachedClient()

  if (bootstrappedClient) return bootstrappedClient

  throw new Error('Database bootstrap did not initialize a default client')
}

/**
 * Returns all cached clients created by {@link createClient}.
 */
export function getClients(): Client[] {
  return [...clients.values()]
}
