import { FuncWarpper } from '@faasjs/test';
import setup from './setup';

describe('change-password', function () {
  let func: FuncWarpper;

  beforeEach(async function () {
    func = await setup('change-password');

    await func.sql.query('INSERT INTO users (id,username,password) VALUES (1,\'hello\',\'world\')');
  });

  test('should work', async function () {
    const res = await func.JSONhandler({
      old_password: 'world',
      new_password: 'hello'
    }, {
      cookie: `key=${func.http.session.encode({ user_id: 1 })}`
    });

    expect(res.statusCode).toEqual(201);

    const row = await func.sql.queryFirst('SELECT password FROM users WHERE id = 1 LIMIT 1');

    expect(row.password).toEqual('hello');
  });

  test('wrong password', async function () {
    const res = await func.JSONhandler({
      old_password: 'hello',
      new_password: 'hello'
    }, {
      cookie: `key=${func.http.session.encode({ user_id: 1 })}`
    });

    expect(res.statusCode).toEqual(500);
    expect(res.body).toEqual('{"error":{"message":"旧密码错误"}}');

    const row = await func.sql.queryFirst('SELECT password FROM users WHERE id = 1 LIMIT 1');

    expect(row.password).toEqual('world');
  });
});
