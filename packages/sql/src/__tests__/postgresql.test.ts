import { Sql } from '../index';
import { Func } from '@faasjs/func';
import { Pool } from 'pg';

describe('connect', function () {
  test('with username', async function () {
    const sql = new Sql({
      name: 'sql',
      adapterType: 'postgresql'
    });

    const func = new Func({
      plugins: [sql],
      async handler () {
        return sql.query('SELECT 1+1');
      }
    });

    func.config = {
      providers: {},
      plugins: {
        sql: {
          type: 'sql',
          config: { user: 'postgres' }
        }
      }
    };
    const handler = func.export().handler;

    expect(await handler({})).toEqual([{ '?column?': 2 }]);
  });

  test('with pool', async function () {
    const pool = new Pool({ user: 'postgres' });
    const sql = new Sql({
      name: 'sql',
      adapterType: 'postgresql',
      config: { pool }
    });

    const func = new Func({
      plugins: [sql],
      async handler () {
        return sql.query('SELECT 1+1');
      }
    });
    func.config = {
      providers: {},
      plugins: {}
    };

    const handler = func.export().handler;

    expect(await handler({})).toEqual([{ '?column?': 2 }]);
  });

  test('fail', async function () {
    const sql = new Sql({
      name: 'sql',
      adapterType: 'postgresql'
    });

    const func = new Func({
      plugins: [sql],
      async handler () {
        return sql.query('SELECT 1+1');
      }
    });

    func.config = {
      providers: {},
      plugins: {
        sql: {
          type: 'sql',
          config: {}
        }
      }
    };
    const handler = func.export().handler;

    try {
      await handler({});
    } catch (error) {
      expect(error.message).toEqual('ER_ACCESS_DENIED_ERROR: Access denied for user \'username\'@\'localhost\' (using password: NO)');
    }
  });
});

test('query faild', async function () {
  const sql = new Sql({
    name: 'sql',
    adapterType: 'postgresql'
  });

  const func = new Func({
    plugins: [sql],
    async handler () {
      return sql.query('A');
    }
  });

  func.config = {
    providers: {},
    plugins: {
      sql: {
        type: 'sql',
        config: { user: 'postgres' }
      }
    }
  };
  const handler = func.export().handler;

  try {
    await handler({});
  } catch (error) {
    expect(error.message).toEqual('syntax error at or near "A"');
  }
});
