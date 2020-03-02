import { Sql } from '../index';
import { Func } from '@faasjs/func';
import { createPool } from 'mysql';

describe('mysql', function () {
  it('with username', async function () {
    const sql = new Sql({
      name: 'sql',
      adapterType: 'mysql'
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
          config: { user: 'travis' }
        }
      }
    };
    const handler = func.export().handler;

    expect(await handler({})).toEqual([{ '1+1': 2 }]);

    sql.adapter.pool.end();
  });

  it('with pool', async function () {
    const pool = createPool({ user: 'travis' });
    const sql = new Sql({
      name: 'sql',
      adapterType: 'mysql',
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

    expect(await handler({})).toEqual([{ '1+1': 2 }]);

    sql.adapter.pool.end();
  });

  it('fail', async function () {
    const sql = new Sql({
      name: 'sql',
      adapterType: 'mysql'
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

    sql.adapter.pool.end();
  });

  it('query faild', async function () {
    const sql = new Sql({
      name: 'sql',
      adapterType: 'mysql'
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
          config: { user: 'travis' }
        }
      }
    };
    const handler = func.export().handler;

    try {
      await handler({});
    } catch (error) {
      expect(error.message).toEqual('ER_PARSE_ERROR: You have an error in your SQL syntax; check the manual that corresponds to your MySQL server version for the right syntax to use near \'A\' at line 1');
    }

    sql.adapter.pool.end();
  });
});
