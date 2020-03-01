import { FuncWarpper } from '@faasjs/test';
import setup from './setup';

describe('signup', function () {
  let func: FuncWarpper;

  beforeEach(async function () {
    func = await setup('signup');
  });

  test('should work', async function () {
    const res = await func.JSONhandler({
      username: 'hello',
      password: 'world'
    });

    expect(res.statusCode).toEqual(201);

    const rows = await func.sql.query('SELECT * FROM users');

    expect(rows.length).toEqual(1);
    expect(rows[0].username).toEqual('hello');
    expect(rows[0].password).toEqual('world');
  });

  test('dup username', async function () {
    await func.sql.query('INSERT INTO users (username,password) VALUES (\'hello\',\'world\')');

    const res = await func.JSONhandler({
      username: 'hello',
      password: 'world'
    });

    expect(res.statusCode).toEqual(500);
    expect(res.body).toEqual('{"error":{"message":"SQLITE_CONSTRAINT: UNIQUE constraint failed: users.username"}}');
  });
});
