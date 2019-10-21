import { Sql } from '../index';
import { Func } from '@faasjs/func';
import { Database } from 'sqlite3';

describe('connect', function () {
  test('with filename', async function () {
    const sql = new Sql({
      name: 'sql',
      adapterType: 'sqlite'
    });

    const func = new Func({
      plugins: [sql],
      handler () {
        return sql.query('SELECT 1+1');
      }
    });

    func.config = {
      providers: {},
      plugins: {
        sql: {
          type: 'sql',
          config: {
            filename: ':memory:'
          }
        }
      }
    };
    const handler = func.export().handler;

    expect(await handler({})).toEqual([{ '1+1': 2 }]);
  });

  test('with pool', async function () {
    const pool = new Database(':memory:');
    const sql = new Sql({
      name: 'sql',
      adapterType: 'sqlite',
      config: {
        pool
      }
    });

    const func = new Func({
      plugins: [sql],
      handler () {
        return sql.query('SELECT 1+1');
      }
    });
    func.config = {
      providers: {},
      plugins: {}
    };

    const handler = func.export().handler;

    expect(await handler({})).toEqual([{ '1+1': 2 }]);
  });

  test('fail', async function () {
    const sql = new Sql({
      name: 'sql',
      adapterType: 'sqlite'
    });

    const func = new Func({
      plugins: [sql],
      handler () {
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
      expect(error.message).toEqual('[Sqlite] connect failed: {}');
    }
  });
});

test('query faild', async function () {
  const sql = new Sql({
    name: 'sql',
    adapterType: 'sqlite'
  });

  const func = new Func({
    plugins: [sql],
    handler () {
      return sql.query('A');
    }
  });

  func.config = {
    providers: {},
    plugins: {
      sql: {
        type: 'sql',
        config: {
          filename: ':memory:'
        }
      }
    }
  };
  const handler = func.export().handler;

  try {
    await handler({});
  } catch (error) {
    expect(error.message).toEqual('SQLITE_ERROR: near "A": syntax error');
  }
});
