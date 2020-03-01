import { FuncWarpper } from '@faasjs/test';
import { Sql } from '@faasjs/sql';
import { CreateOrders, Orders } from '../order';

describe('orders/all', function () {
  let func: FuncWarpper;

  beforeEach(async function () {
    func = new FuncWarpper(require.resolve('../all.func') as string);
    func.sql = func.plugins[0] as Sql;

    await func.mountedHandler();

    await CreateOrders(func.sql);
  });

  test('should work', async function () {
    await Promise.all([
      Orders(func.sql).insert({
        id: 1,
        user_id: 1
      }),
      Orders(func.sql).insert({
        id: 2,
        user_id: 2
      }),
    ]);

    const res = await func.handler({});

    expect(res.length).toEqual(2);
    expect(res[0].id).toEqual(1);
    expect(res[0].user_id).toEqual(1);
    expect(res[1].id).toEqual(2);
    expect(res[1].user_id).toEqual(2);
  });
});
