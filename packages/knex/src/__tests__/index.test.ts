import { Func } from '@faasjs/func';
import { Knex } from '..';

describe('Knex', function () {
  it('config with code', async function () {
    const knex = new Knex({
      config: {
        client: 'sqlite3',
        connection: { filename: ':memory:' },
        useNullAsDefault: true
      }
    });

    const handler = new Func({
      plugins: [knex],
      async handler () {
        return knex.raw('SELECT 1+1');
      }
    }).export().handler;

    expect(await handler({})).toEqual([{ '1+1': 2 }]);
  });

  it('config with env', async function () {
    process.env.SECRET_KNEX_CLIENT = 'sqlite3';
    process.env.SECRET_KNEX_CONNECTION_FILENAME = ':memory:';

    const knex = new Knex({ config: { useNullAsDefault: true } });

    const handler = new Func({
      plugins: [knex],
      async handler () {
        return knex.raw('SELECT 1+1');
      }
    }).export().handler;

    expect(await handler({})).toEqual([{ '1+1': 2 }]);
  });

  it('failed query', async function () {
    const knex = new Knex({
      config: {
        client: 'sqlite3',
        connection: { filename: ':memory:' },
        useNullAsDefault: true
      }
    });

    const handler = new Func({
      plugins: [knex],
      async handler () {
        return knex.raw('SELECT a from a');
      }
    }).export().handler;

    try {
      await handler({});
    } catch (error) {
      expect(error.message).toEqual('SELECT a from a - SQLITE_ERROR: no such table: a');
    }
  });
});
