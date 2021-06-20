import { Sql } from '../index'
import { Func } from '@faasjs/func'
import { Database } from 'sqlite3'

describe('sqlite', function () {
  describe('config', function () {
    it('with filename', async function () {
      const sql = new Sql({
        name: 'sql',
        adapterType: 'sqlite'
      })

      const func = new Func({
        plugins: [sql],
        async handler () {
          return await sql.query('SELECT 1+1')
        }
      })

      func.config = {
        providers: {},
        plugins: {
          sql: {
            type: 'sql',
            config: { filename: ':memory:' }
          }
        }
      }
      const handler = func.export().handler

      expect(await handler({})).toEqual([{ '1+1': 2 }])
    })

    it('with pool', async function () {
      const pool = new Database(':memory:')
      const sql = new Sql({
        name: 'sql',
        adapterType: 'sqlite',
        config: { pool }
      })

      const func = new Func({
        plugins: [sql],
        async handler () {
          return await sql.query('SELECT 1+1')
        }
      })
      func.config = {
        providers: {},
        plugins: {}
      }

      const handler = func.export().handler

      expect(await handler({})).toEqual([{ '1+1': 2 }])
    })

    it('fail', async function () {
      const sql = new Sql({
        name: 'sql',
        adapterType: 'sqlite'
      })

      const func = new Func({
        plugins: [sql],
        async handler () {
          return await sql.query('SELECT 1+1')
        }
      })

      func.config = {
        providers: {},
        plugins: {
          sql: {
            type: 'sql',
            config: {}
          }
        }
      }
      const handler = func.export().handler

      try {
        await handler({})
      } catch (error) {
        expect(error.message).toEqual('[Sqlite] connect failed: {}')
      }
    })

    it('query faild', async function () {
      const sql = new Sql({
        name: 'sql',
        adapterType: 'sqlite'
      })

      const func = new Func({
        plugins: [sql],
        async handler () {
          return await sql.query('A')
        }
      })

      func.config = {
        providers: {},
        plugins: {
          sql: {
            type: 'sql',
            config: { filename: ':memory:' }
          }
        }
      }
      const handler = func.export().handler

      try {
        await handler({})
      } catch (error) {
        expect(error.message).toEqual('SQLITE_ERROR: near "A": syntax error')
      }
    })

    it('config with env', async function () {
      process.env.SECRET_SQL_FILENAME = ':memory:'

      const sql = new Sql({
        name: 'sql',
        adapterType: 'sqlite'
      })

      const func = new Func({
        plugins: [sql],
        async handler () {
          return await sql.query('SELECT 1+1')
        }
      })

      func.config = {
        providers: {},
        plugins: { sql: { type: 'sql' } }
      }
      const handler = func.export().handler

      expect(await handler({})).toEqual([{ '1+1': 2 }])
    })
  })

  describe('query', function () {
    it('query', async function () {
      const sql = new Sql({
        name: 'sql',
        adapterType: 'sqlite'
      })

      const func = new Func({
        plugins: [sql],
        async handler () {
          return await sql.query('SELECT 1+1')
        }
      })

      const handler = func.export().handler

      expect(await handler({})).toEqual([{ '1+1': 2 }])
    })

    it('queryFirst', async function () {
      const sql = new Sql({
        name: 'sql',
        adapterType: 'sqlite'
      })

      const func = new Func({
        plugins: [sql],
        async handler () {
          return await sql.queryFirst('SELECT 1+1')
        }
      })

      const handler = func.export().handler

      expect(await handler({})).toEqual({ '1+1': 2 })
    })

    it('queryMulti', async function () {
      const sql = new Sql({
        name: 'sql',
        adapterType: 'sqlite'
      })

      const func = new Func({
        plugins: [sql],
        async handler () {
          return await sql.queryMulti(['SELECT 1+1', 'SELECT 2+2'])
        }
      })

      const handler = func.export().handler

      expect(await handler({})).toEqual([
        [{ '1+1': 2 }],
        [{ '2+2': 4 }]
      ])
    })
  })
})
