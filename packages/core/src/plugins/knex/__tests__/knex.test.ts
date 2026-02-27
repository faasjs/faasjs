import { randomUUID } from 'node:crypto'
import { rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { Func, useFunc } from '../../..'
import {
  createPgliteKnex,
  Knex,
  mountFaasKnex,
  query,
  raw,
  transaction,
  unmountFaasKnex,
  useKnex,
} from '../../../index'

const originalSecretKnexClient = process.env.SECRET_KNEX_CLIENT
const originalSecretKnexConnection = process.env.SECRET_KNEX_CONNECTION
const originalSecretKnexConnectionFilename = process.env.SECRET_KNEX_CONNECTION_FILENAME

function restoreSecretKnexEnv() {
  if (typeof originalSecretKnexClient === 'string')
    process.env.SECRET_KNEX_CLIENT = originalSecretKnexClient
  else delete process.env.SECRET_KNEX_CLIENT

  if (typeof originalSecretKnexConnection === 'string')
    process.env.SECRET_KNEX_CONNECTION = originalSecretKnexConnection
  else delete process.env.SECRET_KNEX_CONNECTION

  if (typeof originalSecretKnexConnectionFilename === 'string')
    process.env.SECRET_KNEX_CONNECTION_FILENAME = originalSecretKnexConnectionFilename
  else delete process.env.SECRET_KNEX_CONNECTION_FILENAME
}

describe('Knex', () => {
  afterEach(async () => {
    const globalWithKnex = globalThis as typeof globalThis & {
      FaasJS_Knex?: Record<
        string,
        {
          schema?: () => {
            dropTableIfExists: (name: string) => Promise<unknown>
          }
          quit?: () => Promise<void>
          adapter?: {
            schema?: {
              dropTableIfExists?: (name: string) => Promise<unknown>
            }
            destroy?: () => Promise<unknown>
          }
        }
      >
    }

    restoreSecretKnexEnv()

    const knex = globalWithKnex.FaasJS_Knex?.knex

    if (!knex) return

    if (typeof knex.schema === 'function') await knex.schema().dropTableIfExists('test')
    else await knex.adapter?.schema?.dropTableIfExists?.('test')

    if (typeof knex.quit === 'function') await knex.quit()
    else {
      await knex.adapter?.destroy?.()
      if (globalWithKnex.FaasJS_Knex) delete globalWithKnex.FaasJS_Knex.knex
    }
  })

  describe('config', () => {
    it('with code', async () => {
      const knex = new Knex({
        config: {
          client: 'sqlite3',
          connection: { filename: ':memory:' },
          useNullAsDefault: true,
        },
      })

      const handler = new Func({
        plugins: [knex],
        async handler() {
          return await knex.raw('SELECT 1+1')
        },
      }).export().handler

      expect(await handler({})).toEqual([{ '1+1': 2 }])
    })

    it('with env', async () => {
      process.env.SECRET_KNEX_CLIENT = 'sqlite3'
      process.env.SECRET_KNEX_CONNECTION_FILENAME = ':memory:'

      const knex = new Knex({ config: { useNullAsDefault: true } })

      const handler = new Func({
        plugins: [knex],
        async handler() {
          return await knex.raw('SELECT 1+1')
        },
      }).export().handler

      expect(await handler({})).toEqual([{ '1+1': 2 }])
    })

    it('with better-sqlite3 client', async () => {
      const knex = new Knex({
        config: {
          client: 'better-sqlite3',
          connection: { filename: ':memory:' },
        },
      })

      const handler = new Func({
        plugins: [knex],
        async handler() {
          return await knex.raw('SELECT 1+1')
        },
      }).export().handler

      expect(await handler({})).toEqual([{ '1+1': 2 }])
    })

    it('with special npm package', async () => {
      const knex = new Knex({
        config: {
          client: 'npm:cloudflare-d1-http-knex/mock',
        },
      })

      const handler = new Func({
        plugins: [knex],
        async handler() {
          return await knex.raw('SELECT 1+1')
        },
      }).export().handler

      expect(await handler({})).toEqual([{ '1+1': 2 }])
    })

    it('should reject invalid npm client exports', async () => {
      const invalidClient = `npm:data:text/javascript,${encodeURIComponent('export default { driver: true }')}`
      const knex = new Knex({
        name: `knex-invalid-${randomUUID()}`,
        config: {
          client: invalidClient,
        },
      })

      const handler = new Func({
        plugins: [knex],
        async handler() {
          return true
        },
      }).export().handler

      await expect(handler({})).rejects.toThrow(`Invalid client: ${invalidClient}`)
    })
  })

  it('should throw when client is not initialized', async () => {
    const knex = new Knex({
      name: `knex-unmounted-${randomUUID()}`,
    })

    await expect(knex.raw('SELECT 1')).rejects.toThrow('[Knex] Client not initialized.')
    await expect(knex.transaction(async () => null)).rejects.toThrow(
      `[${knex.name}] Client not initialized.`,
    )
    expect(() => knex.schema()).toThrow(`[${knex.name}] Client not initialized.`)
  })

  describe('query', () => {
    it('should work', async () => {
      const knex = new Knex({
        config: {
          client: 'sqlite3',
          connection: { filename: ':memory:' },
          useNullAsDefault: true,
        },
      })

      const handler = new Func({
        plugins: [knex],
        async handler() {
          await knex.schema().createTable('test', (t) => {
            t.increments('id')
          })
          return knex.query('test')
        },
      }).export().handler

      expect(await handler({})).toEqual([])
    })

    it('failed query', async () => {
      const knex = new Knex({
        config: {
          client: 'sqlite3',
          connection: { filename: ':memory:' },
          useNullAsDefault: true,
        },
      })

      const handler = new Func({
        plugins: [knex],
        async handler() {
          return await knex.raw('SELECT a from a')
        },
      }).export().handler

      try {
        await handler({})
      } catch (error: any) {
        expect(error.message).toEqual('SELECT a from a - SQLITE_ERROR: no such table: a')
      }
    })
  })

  it('pure transaction', async () => {
    const knex = new Knex({
      config: {
        client: 'sqlite3',
        connection: { filename: ':memory:' },
        useNullAsDefault: true,
      },
    })

    let commit = false

    const handler = new Func({
      plugins: [knex],
      async handler() {
        await knex.schema().createTable('test', (t) => {
          t.increments('id')
        })

        return await knex.transaction(async (trx) => {
          trx.on('commit', () => (commit = true))
          return await trx.insert({}).into('test').returning('id')
        })
      },
    }).export().handler

    expect(await handler({})).toEqual([1])
    expect(commit).toBeTruthy()
  })

  it('transaction should skip extra commit when trx is completed', async () => {
    const knex = new Knex({
      config: {
        client: 'sqlite3',
        connection: { filename: ':memory:' },
        useNullAsDefault: true,
      },
    })

    const handler = new Func({
      plugins: [knex],
      async handler() {
        await knex.schema().createTable('test', (t) => {
          t.increments('id')
        })

        const result = await knex.transaction(async (trx) => {
          await trx.insert({}).into('test')
          await trx.commit()
          return 'done'
        })

        return {
          result,
          rows: await knex.query('test'),
        }
      },
    }).export().handler

    expect(await handler({})).toEqual({
      result: 'done',
      rows: [{ id: 1 }],
    })
  })

  it('transaction with trx', async () => {
    const knex = new Knex({
      config: {
        client: 'sqlite3',
        connection: { filename: ':memory:' },
        useNullAsDefault: true,
      },
    })

    const handler = new Func({
      plugins: [knex],
      async handler() {
        await knex.schema().createTable('test', (t) => {
          t.increments('id')
        })

        const transaction = await knex.adapter.transaction()

        await transaction.commit()

        await knex.transaction(
          async (trx) => await trx.insert({}).into('test'),
          {},
          { trx: transaction },
        )

        return knex.query('test')
      },
    }).export().handler

    await expect(handler({})).rejects.toThrow('Transaction query already complete')
  })

  it('transaction with error', async () => {
    const knex = new Knex({
      config: {
        client: 'sqlite3',
        connection: { filename: ':memory:' },
        useNullAsDefault: true,
      },
    })

    let rollback = false
    const handler = new Func({
      plugins: [knex],
      async handler() {
        await knex.schema().createTable('test', (t) => {
          t.increments('id')
        })

        await knex.transaction(async (trx) => {
          trx.on('rollback', () => (rollback = true))
          await trx.insert({}).into('test')
          throw Error('test')
        })

        return knex.query('test')
      },
    }).export().handler

    await expect(async () => await handler({})).rejects.toThrow('test')

    expect(rollback).toBeTruthy()
  })

  it('useKnex', async () => {
    const func = useFunc(() => {
      useKnex({
        config: {
          client: 'sqlite3',
          connection: { filename: ':memory:' },
          useNullAsDefault: true,
        },
      })

      return async () => {
        await useKnex()
          .schema()
          .createTable('test', (t) => {
            t.increments('id')
          })

        return await useKnex().query('test')
      }
    })

    expect(await func.export().handler({})).toEqual([])
  })

  it('hooks', async () => {
    const func = useFunc(() => {
      useKnex({
        config: {
          client: 'sqlite3',
          connection: { filename: ':memory:' },
        },
      })

      return async () => {
        await useKnex()
          .schema()
          .createTable('test', (t) => {
            t.increments('id')
            t.integer('value')
          })

        const value = await raw('SELECT 1+1 AS count').then((res: any) => res[0].count)

        await transaction(async (trx) => {
          await trx
            .insert({
              value,
            })
            .into('test')
        })

        return await query('test')
      }
    })

    expect(await func.export().handler({})).toEqual([{ id: 1, value: 2 }])
  })

  it('should work with pg via mounted pglite adapter', async () => {
    const db = await createPgliteKnex({}, `memory://${randomUUID()}`)

    mountFaasKnex(db, {
      name: 'pg',
      config: {
        client: 'pg',
      },
    })

    try {
      const knex = new Knex({
        name: 'pg',
        config: {
          client: 'pg',
        },
      })

      const handler = new Func({
        plugins: [knex],
        async handler() {
          return await knex
            .raw(
              'SELECT 1+1 AS value, 1::int2 AS int2, 2::int4 AS int4, 9007199254740993::int8 AS int8, 1.25::float4 AS float4, 2.5::float8 AS float8, 3.75::numeric AS numeric',
            )
            .then((res: any) => res.rows)
        },
      }).export().handler

      expect(await handler({})).toEqual([
        {
          value: 2,
          int2: 1,
          int4: 2,
          int8: Number.parseInt('9007199254740993', 10),
          float4: 1.25,
          float8: 2.5,
          numeric: 3.75,
        },
      ])
    } finally {
      await db.destroy()
      unmountFaasKnex('pg')
    }
  })

  it('should work with pglite client', async () => {
    const knex = new Knex({
      config: {
        client: 'pglite',
        connection: `memory://${randomUUID()}`,
      },
    })

    const handler = new Func({
      plugins: [knex],
      async handler() {
        return await knex.raw('SELECT 1+1 AS value').then((res: any) => res.rows)
      },
    }).export().handler

    expect(await handler({})).toEqual([{ value: 2 }])
  })

  it('should ignore pool config for pglite client', async () => {
    const knex = new Knex({
      config: {
        client: 'pglite',
        connection: `memory://${randomUUID()}`,
        pool: {
          min: 0,
          max: 10,
        },
      } as any,
    })

    const handler = new Func({
      plugins: [knex],
      async handler() {
        return await knex.raw('SELECT 1+1 AS value').then((res: any) => res.rows)
      },
    }).export().handler

    expect(await handler({})).toEqual([{ value: 2 }])
  })

  it('should reject pglite object connection', async () => {
    const knex = new Knex({
      config: {
        client: 'pglite',
        connection: {
          filename: './tmp',
        } as any,
      },
    })

    const handler = new Func({
      plugins: [knex],
      async handler() {
        return await knex.raw('SELECT 1+1')
      },
    }).export().handler

    await expect(handler({})).rejects.toThrow('Invalid "pglite" connection')
  })

  it('should default to memory when pglite connection is missing', async () => {
    const knex = new Knex({
      config: {
        client: 'pglite',
      },
    })

    const handler = new Func({
      plugins: [knex],
      async handler() {
        return await knex.raw('SELECT 1+1 AS value').then((res: any) => res.rows)
      },
    }).export().handler

    expect(await handler({})).toEqual([{ value: 2 }])
  })

  it('should reject empty pglite connection string', async () => {
    const knex = new Knex({
      config: {
        client: 'pglite',
        connection: '',
      },
    })

    const handler = new Func({
      plugins: [knex],
      async handler() {
        return await knex.raw('SELECT 1+1')
      },
    }).export().handler

    await expect(handler({})).rejects.toThrow('Invalid "pglite" connection')
  })

  it('should reject pglite connection env fragments', async () => {
    process.env.SECRET_KNEX_CLIENT = 'pglite'
    process.env.SECRET_KNEX_CONNECTION = `memory://${randomUUID()}`
    process.env.SECRET_KNEX_CONNECTION_FILENAME = './tmp'

    const knex = new Knex()

    const handler = new Func({
      plugins: [knex],
      async handler() {
        return await knex.raw('SELECT 1+1')
      },
    }).export().handler

    try {
      await expect(handler({})).rejects.toThrow('Use SECRET_KNEX_CONNECTION instead.')
    } finally {
      delete process.env.SECRET_KNEX_CLIENT
      delete process.env.SECRET_KNEX_CONNECTION
      delete process.env.SECRET_KNEX_CONNECTION_FILENAME
    }
  })

  it('should create parent directory for pglite path connection', async () => {
    const rootDir = join(tmpdir(), `faasjs-knex-pglite-${randomUUID()}`)
    const dataDir = join(rootDir, 'data', 'knex')
    let knex: Knex | undefined

    try {
      knex = new Knex({
        config: {
          client: 'pglite',
          connection: dataDir,
        },
      })
      const mountedKnex = knex

      const handler = new Func({
        plugins: [mountedKnex],
        async handler() {
          return await mountedKnex.raw('SELECT 1+1 AS value').then((res: any) => res.rows)
        },
      }).export().handler

      expect(await handler({})).toEqual([{ value: 2 }])
    } finally {
      if (knex) await knex.quit()
      await rm(rootDir, { recursive: true, force: true })
    }
  })

  it('should persist pglite data with directory connection', async () => {
    const dataDir = join(tmpdir(), `faasjs-knex-pglite-${randomUUID()}`)
    let writer: Knex | undefined
    let reader: Knex | undefined

    try {
      writer = new Knex({
        config: {
          client: 'pglite',
          connection: dataDir,
        },
      })
      const writerKnex = writer

      const writeHandler = new Func({
        plugins: [writerKnex],
        async handler() {
          await writerKnex.schema().createTable('test', (t) => {
            t.integer('id').primary()
          })

          await writerKnex.query('test').insert({ id: '1' })

          return await writerKnex.query('test')
        },
      }).export().handler

      expect(await writeHandler({})).toEqual([{ id: 1 }])

      reader = new Knex({
        config: {
          client: 'pglite',
          connection: dataDir,
        },
      })
      const readerKnex = reader

      const readHandler = new Func({
        plugins: [readerKnex],
        async handler() {
          return await readerKnex.query('test')
        },
      }).export().handler

      expect(await readHandler({})).toEqual([{ id: 1 }])
    } finally {
      if (reader) await reader.quit()
      if (writer) await writer.quit()
      await rm(dataDir, { recursive: true, force: true })
    }
  })

  it('should swallow destroy errors in quit', async () => {
    const name = `knex-quit-${randomUUID()}`
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    mountFaasKnex(
      {
        adapter: {
          destroy: async () => {
            throw Error('destroy failed')
          },
        },
      } as any,
      {
        name,
        config: {
          client: 'pg',
        },
      },
    )

    try {
      const knex = new Knex({ name })

      await knex.quit()

      expect(errorSpy).toHaveBeenCalled()
    } finally {
      errorSpy.mockRestore()
      unmountFaasKnex(name)
    }
  })
})
