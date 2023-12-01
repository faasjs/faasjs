import { Func, useFunc } from '@faasjs/func'
import { Knex, query, useKnex } from '..'
import { expectType, expectNotType } from 'tsd'
import type { Tables } from 'knex/types/tables'

declare module 'knex/types/tables' {
  interface Tables {
    test: {
      id: string
    }
  }
}

describe('Knex', () => {
  afterEach(async () => {
    await useKnex().schema().dropTableIfExists('test')
    await useKnex().quit()
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

  it('transaction', async () => {
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

        await knex.transaction(trx => trx.insert({}).into('test'))

        return knex.query('test')
      },
    }).export().handler

    expect(await handler({})).toEqual([{ id: 1 }])
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

  it('useKnex', async () => {
    const func = useFunc(() => {
      const knex1 = useKnex({
        config: {
          client: 'sqlite3',
          connection: { filename: ':memory:' },
          useNullAsDefault: true,
        },
      })

      return async () => {
        await knex1.schema().createTable('test', t => {
          t.increments('id')
        })

        const knex2 = useKnex()

        return await knex2.query('test')
      }
    })

    expect(await func.export().handler({})).toEqual([])
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

    expectType<Tables['test'][]>(await query('test'))
    expectNotType<any[]>(await query('test'))

    expectType<any>(await query('testtest'))

    expectType<{ value: string }>(
      await query<any, { value: string }>('testtest')
    )
    expectNotType<any>(await query<{ value: string }>('testtest'))
  })
})
