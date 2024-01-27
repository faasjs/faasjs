/**
 * FaasJS's sql plugin, base on [Knex](https://knexjs.org/).
 *
 * [![License: MIT](https://img.shields.io/npm/l/@faasjs/knex.svg)](https://github.com/faasjs/faasjs/blob/main/packages/faasjs/knex/LICENSE)
 * [![NPM Version](https://img.shields.io/npm/v/@faasjs/knex.svg)](https://www.npmjs.com/package/@faasjs/knex)
 *
 * ## Install
 *
 * ```sh
 * npm install @faasjs/knex
 * ```
 * @packageDocumentation
 */
import {
  Plugin,
  Next,
  DeployData,
  MountData,
  usePlugin,
  UseifyPlugin,
  InvokeData,
} from '@faasjs/func'
import { Logger } from '@faasjs/logger'
import { deepMerge } from '@faasjs/deep_merge'
import knex, { Knex as OriginKnex } from 'knex'
import { randomUUID } from 'node:crypto'

/**
 * Origin [knex](https://knexjs.org/) instance.
 */
export const originKnex = knex

/**
 * Origin [knex](https://knexjs.org/) type.
 */
export type { OriginKnex }

export type KnexConfig = {
  name?: string
  config?: OriginKnex.Config
}

const Name = 'knex'

declare let global: {
  FaasJS_Knex?: Record<string, Knex>
}

if (!global.FaasJS_Knex) {
  global.FaasJS_Knex = {}
}

export class Knex implements Plugin {
  public readonly type: string = Name
  public readonly name: string = Name
  public config: OriginKnex.Config
  public adapter: OriginKnex
  public query: OriginKnex
  public logger: Logger

  constructor(config?: KnexConfig) {
    if (config) {
      this.name = config.name || this.type
      this.config = config.config || Object.create(null)
    } else {
      this.name = this.type
      this.config = Object.create(null)
    }
  }

  public async onDeploy(data: DeployData, next: Next): Promise<void> {
    const client = (data.config.plugins[this.name].config as OriginKnex.Config)
      .client as string
    if (!client) throw Error('[Knex] client required.')

    data.dependencies['@faasjs/knex'] = '*'
    if (client === 'sqlite3') data.dependencies['better-sqlite3'] = '*'
    else data.dependencies[client] = '*'
    new Logger(this.name).debug(`add dependencies: ${client}`)

    await next()
  }

  public async onMount(data: MountData, next: Next): Promise<void> {
    this.logger = data.logger

    if (global.FaasJS_Knex[this.name]) {
      this.config = global.FaasJS_Knex[this.name].config
      this.adapter = global.FaasJS_Knex[this.name].adapter
      this.query = this.adapter
      this.logger.debug('[%s] use exists adapter', this.name)
      await next()
      return
    }

    const prefix = `SECRET_${this.name.toUpperCase()}_`

    for (let key in process.env)
      if (key.startsWith(prefix)) {
        const value = process.env[key]
        key = key.replace(prefix, '').toLowerCase()
        if (typeof (this.config as any)[key] === 'undefined')
          if (key.startsWith('connection_')) {
            if (!this.config.connection) {
              this.config.connection = Object.create(null)
            }
            ;(this.config as any).connection[key.replace('connection_', '')] =
              value
          } else (this.config as any)[key] = value
      }

    if (data.config.plugins?.[this.name]?.config)
      this.config = deepMerge(
        data.config.plugins[this.name].config,
        this.config
      )

    if (this.config.client === 'sqlite3') {
      this.config.client = 'better-sqlite3'
      this.config.useNullAsDefault = true
    }

    if (this.config.client === 'pg') {
      if (!this.config.pool) this.config.pool = Object.create(null)

      this.config.pool = Object.assign(
        {
          propagateCreateError: false,
          min: 0,
          max: 10,
          acquireTimeoutMillis: 5000,
          idleTimeoutMillis: 30000,
        },
        this.config.pool
      )

      if (
        typeof this.config.connection === 'string' &&
        !this.config.connection.includes('json=true')
      )
        this.config.connection = `${this.config.connection}?json=true`
    }

    this.adapter = knex(this.config)

    if (this.config.client === 'pg') {
      const pg = require('pg')

      for (const t of ['INT2', 'INT4', 'INT8'])
        pg.types.setTypeParser(pg.types.builtins[t], (v: string) => parseInt(v))

      for (const t of ['FLOAT4', 'FLOAT8', 'NUMERIC'])
        pg.types.setTypeParser(pg.types.builtins[t], (v: string) =>
          parseFloat(v)
        )
    }

    this.query = this.adapter

    this.query
      .on('query', ({ sql, __knexQueryUid, bindings }) => {
        if (!__knexQueryUid) return

        this.logger.time(`Knex${this.name}${__knexQueryUid}`)
        this.logger.debug(
          '[%s] [%s] query begin: %s %j',
          this.name,
          __knexQueryUid,
          sql,
          bindings
        )
      })
      .on('query-response', (response, { sql, __knexQueryUid, bindings }) => {
        if (!__knexQueryUid) return

        this.logger.timeEnd(
          `Knex${this.name}${__knexQueryUid}`,
          '[%s] [%s] query done: %s %j %j',
          this.name,
          __knexQueryUid,
          sql,
          bindings,
          response
        )
      })
      .on('query-error', (_, { __knexQueryUid, sql, bindings }) => {
        if (!__knexQueryUid) return

        this.logger.timeEnd(
          `Knex${this.name}${__knexQueryUid}`,
          '[%s] [%s] query failed: %s %j',
          this.name,
          __knexQueryUid,
          sql,
          bindings
        )
      })

    data.logger.debug('[%s] connected', this.name)

    global.FaasJS_Knex[this.name] = this

    await next()
  }

  public async onInvoke(data: InvokeData<any, any, any>, next: Next) {
    this.logger = data.logger
    await next()
  }

  public async raw<TResult = any>(
    sql: string,
    bindings: OriginKnex.RawBinding[] | OriginKnex.ValueDict = []
  ): Promise<OriginKnex.Raw<TResult>> {
    if (!this.adapter) throw Error('[Knex] Client not initialized.')

    return this.adapter.raw<TResult>(sql, bindings)
  }

  /**
   * Wraps a transaction, returning a promise that resolves to the return value of the callback.
   *
   * - Support 'commit' and 'rollback' event.
   */
  public async transaction<TResult = any>(
    scope: (trx: OriginKnex.Transaction<any, any>) => Promise<TResult>,
    config?: OriginKnex.TransactionConfig,
    options?: {
      trx?: OriginKnex.Transaction
    }
  ): Promise<TResult> {
    if (!this.adapter) throw Error(`[${this.name}] Client not initialized.`)

    if (options?.trx) return scope(options.trx)

    const trx = await this.adapter.transaction(config)
    const trxId = randomUUID()
    this.logger.debug('[%s] [%s] transaction begin', this.name, trxId)

    try {
      const result = await scope(trx)

      if (trx.isCompleted()) {
        this.logger.debug(
          '[%s] [%s] transaction has been finished in scope',
          this.name,
          trxId
        )
        return result
      }

      this.logger.debug('[%s] [%s] transaction begin commit', this.name, trxId)
      await trx.commit()
      this.logger.debug(
        '[%s] [%s] transaction committed: %j',
        this.name,
        trxId,
        result
      )
      trx.emit('commit')
      return result
    } catch (error) {
      await trx.rollback(error)
      this.logger.error(
        '[%s] [%s] transaction rollback: %s',
        this.name,
        trxId,
        error
      )
      trx.emit('rollback', error)
      throw error
    }
  }

  public schema(): OriginKnex.SchemaBuilder {
    if (!this.adapter) throw Error(`[${this.name}] Client not initialized.`)

    return this.adapter.schema
  }

  public async quit(): Promise<void> {
    try {
      await global.FaasJS_Knex[this.name].adapter.destroy()
      delete global.FaasJS_Knex[this.name]
    } catch (error) {
      console.error(error)
    }
  }
}

export function useKnex(config?: KnexConfig): UseifyPlugin<Knex> {
  const name = config?.name || Name

  if (global.FaasJS_Knex[name]) return usePlugin<Knex>(global.FaasJS_Knex[name])

  return usePlugin<Knex>(new Knex(config))
}

export function query<TName extends OriginKnex.TableNames>(
  table: TName
): OriginKnex.QueryBuilder<
  OriginKnex.TableType<TName>,
  {
    _base: OriginKnex.ResolveTableType<OriginKnex.TableType<TName>, 'base'>
    _hasSelection: false
    _keys: never
    // biome-ignore lint/complexity/noBannedTypes: <explanation>
    _aliases: {}
    _single: false
    // biome-ignore lint/complexity/noBannedTypes: <explanation>
    _intersectProps: {}
    _unionProps: never
  }[]
>
export function query<TName extends {} = any, TResult = any[]>(
  table: string
): OriginKnex.QueryBuilder<TName, TResult>
export function query<
  // biome-ignore lint/complexity/noBannedTypes: <explanation>
  TName extends OriginKnex.TableNames | {} = any,
  TResult = any[],
>(
  table: TName extends OriginKnex.TableNames ? TName : string
): TName extends OriginKnex.TableNames
  ? OriginKnex.QueryBuilder<
      OriginKnex.TableType<TName>,
      {
        _base: OriginKnex.ResolveTableType<OriginKnex.TableType<TName>, 'base'>
        _hasSelection: false
        _keys: never
        // biome-ignore lint/complexity/noBannedTypes: <explanation>
        _aliases: {}
        _single: false
        // biome-ignore lint/complexity/noBannedTypes: <explanation>
        _intersectProps: {}
        _unionProps: never
      }[]
    >
  : OriginKnex.QueryBuilder<TName, TResult> {
  return useKnex().query<TName, TResult>(
    table
  ) as TName extends OriginKnex.TableNames
    ? OriginKnex.QueryBuilder<
        OriginKnex.TableType<TName>,
        {
          _base: OriginKnex.ResolveTableType<
            OriginKnex.TableType<TName>,
            'base'
          >
          _hasSelection: false
          _keys: never
          // biome-ignore lint/complexity/noBannedTypes: <explanation>
          _aliases: {}
          _single: false
          // biome-ignore lint/complexity/noBannedTypes: <explanation>
          _intersectProps: {}
          _unionProps: never
        }[]
      >
    : OriginKnex.QueryBuilder<TName, TResult>
}

export async function transaction<TResult = any>(
  scope: (trx: OriginKnex.Transaction<any, any>) => Promise<TResult>,
  config?: OriginKnex.TransactionConfig,
  options?: {
    trx?: OriginKnex.Transaction
  }
): Promise<TResult> {
  return useKnex().transaction<TResult>(scope, config, options)
}

export async function raw<TResult = any>(
  sql: string,
  bindings: OriginKnex.RawBinding[] | OriginKnex.ValueDict = []
): Promise<OriginKnex.Raw<TResult>> {
  return useKnex().raw<TResult>(sql, bindings)
}
