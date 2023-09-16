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

describe('Knex', function () {
  afterEach(async function () {
    await useKnex().schema().dropTableIfExists('test')
    await useKnex().quit()
  })

  describe('config', function () {
    it('with code', async function () {
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

    it('with env', async function () {
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

  describe('query', function () {
    it('should work', async function () {
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
          await knex.schema().createTable('test', function (t) {
            t.increments('id')
          })
          return knex.query('test')
        },
      }).export().handler

      expect(await handler({})).toEqual([])
    })

    it('failed query', async function () {
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

  it('transaction', async function () {
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
        await knex.schema().createTable('test', function (t) {
          t.increments('id')
        })

        await knex.transaction(function (trx) {
          return trx.insert({}).into('test')
        })

        return knex.query('test')
      },
    }).export().handler

    expect(await handler({})).toEqual([{ id: 1 }])
  })

  it('useKnex', async function () {
    const func = useFunc(function () {
      const knex1 = useKnex({
        config: {
          client: 'sqlite3',
          connection: { filename: ':memory:' },
          useNullAsDefault: true,
        },
      })

      return async function () {
        await knex1.schema().createTable('test', function (t) {
          t.increments('id')
        })

        const knex2 = useKnex()

        return await knex2.query('test')
      }
    })

    expect(await func.export().handler({})).toEqual([])
  })

  it('check types', async function () {
    const func = useFunc(function () {
      const knex = useKnex({
        config: {
          client: 'sqlite3',
          connection: { filename: ':memory:' },
        },
      })

      // eslint-disable-next-line @typescript-eslint/no-empty-function
      return async function () {
        await knex
          .schema()
          .createTable('test', function (t) {
            t.increments('id')
          })
          .createTable('testtest', function (t) {
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
