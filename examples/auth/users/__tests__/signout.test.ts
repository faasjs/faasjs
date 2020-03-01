import { FuncWarpper } from '@faasjs/test';
import setup from './setup';

describe('signout', function () {
  let func: FuncWarpper;

  beforeEach(async function () {
    func = await setup('signout');

    await func.sql.query('INSERT INTO users (id,username,password) VALUES (1,\'hello\',\'world\')');
  });

  test('should work', async function () {
    const res = await func.handler({
      headers: {
        cookie: `key=${func.http.session.encode({ user_id: 1 })}`
      }
    });

    expect(func.http.session.decode(res.headers['Set-Cookie'][0].match(/key=([^;]+)/)[1])).toEqual({});
    expect(res.statusCode).toEqual(201);
  });
});
