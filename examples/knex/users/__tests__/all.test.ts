import { FuncWarpper } from '@faasjs/test';
import { Sql } from '@faasjs/sql';
import { CreateUsers, Users } from '../user';

describe('users', function () {
  let func: FuncWarpper;

  beforeEach(async function () {
    func = new FuncWarpper(require.resolve('../all.func') as string);
    func.sql = func.plugins[0] as Sql;

    await func.mountedHandler();

    await CreateUsers(func.sql);
  });

  test('should work', async function () {
    await Promise.all([
      Users(func.sql).insert({
        id: 1,
        name: 'hi'
      }),
      Users(func.sql).insert({
        id: 2,
        name: 'hello'
      }),
    ]);

    const res = await func.handler({});

    expect(res.length).toEqual(2);
    expect(res[0].id).toEqual(1);
    expect(res[0].name).toEqual('hi');
    expect(res[1].id).toEqual(2);
    expect(res[1].name).toEqual('hello');
  });
});
