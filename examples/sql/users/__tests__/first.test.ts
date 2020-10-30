import { FuncWarpper } from '@faasjs/test';
import { Sql } from '@faasjs/sql';
import { CreateUsers, Users } from '../user';

describe('users', function () {
  let func: FuncWarpper;

  beforeEach(async function () {
    func = new FuncWarpper(require.resolve('../first.func') as string);
    func.sql = func.plugins[0] as Sql;

    await func.mount();

    await CreateUsers(func.sql);
  });

  test('should work', async function () {
    await Users(func.sql).insert({
      id: 1,
      name: 'hi'
    });

    const res = await func.handler({});

    expect(res.length).toEqual(1);
    expect(res[0].id).toEqual(1);
    expect(res[0].name).toEqual('hi');
  });
});
