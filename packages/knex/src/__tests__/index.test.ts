import { createPgliteKnex, mountFaasKnex, unmountFaasKnex } from '@faasjs/dev'
import { Func, useFunc } from '@faasjs/func'
import type { Tables } from 'knex/types/tables'
import { afterEach, assertType, describe, expect, it } from 'vitest'
import { Knex, query, raw, transaction, useKnex } from '..'

declare module 'knex/types/tables' {
  interface Tables {
    test: {
      id: string
    }
  }
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
    const knex = globalWithKnex.FaasJS_Knex?.knex

    if (!knex) return

    if (typeof knex.schema === 'function')
      await knex.schema().dropTableIfExists('test')
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
          await knex.schema().createTable('test', t => {
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
        expect(error.message).toEqual(
          'SELECT a from a - SQLITE_ERROR: no such table: a'
        )
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
        await knex.schema().createTable('test', t => {
          t.increments('id')
        })

        return await knex.transaction(async trx => {
          trx.on('commit', () => (commit = true))
          return await trx.insert({}).into('test').returning('id')
        })
      },
    }).export().handler

    expect(await handler({})).toEqual([1])
    expect(commit).toBeTruthy()
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
        await knex.schema().createTable('test', t => {
          t.increments('id')
        })

        const transaction = await knex.adapter.transaction()

        await transaction.commit()

        await knex.transaction(
          async trx => await trx.insert({}).into('test'),
          {},
          { trx: transaction }
        )

        return knex.query('test')
      },
    }).export().handler

    expect(() => handler({})).rejects.toThrow(
      'Transaction query already complete'
    )
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
        await knex.schema().createTable('test', t => {
          t.increments('id')
        })

        await knex.transaction(async trx => {
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
          .createTable('test', t => {
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
          .createTable('test', t => {
            t.increments('id')
            t.integer('value')
          })

        const value = await raw('SELECT 1+1 AS count').then(
          (res: any) => res[0].count
        )

        await transaction(async trx => {
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

  it('check types', async () => {
    const func = useFunc(() => {
      const knex = useKnex({
        config: {
          client: 'sqlite3',
          connection: { filename: ':memory:' },
        },
      })

      return async () => {
        await knex
          .schema()
          .createTable('test', t => {
            t.increments('id')
          })
          .createTable('testtest', t => {
            t.increments('id')
          })
      }
    })
    await func.export().handler({})

    assertType<Tables['test'][]>(await query('test'))

    assertType<any>(await query('testtest'))

    assertType<{ value: string }>(
      await query<any, { value: string }>('testtest')
    )
  })

  it('should work with pg via pglite', async () => {
    const db = createPgliteKnex()

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
          connection: {
            connectionString:
              'postgres://postgres:postgres@localhost:5432/testing',
          },
        },
      })

      const handler = new Func({
        plugins: [knex],
        async handler() {
          return await knex
            .raw('SELECT 1+1 AS value')
            .then((res: any) => res.rows)
        },
      }).export().handler

      expect(await handler({})).toEqual([{ value: 2 }])
    } finally {
      await db.destroy()
      unmountFaasKnex('pg')
    }
  })
})
