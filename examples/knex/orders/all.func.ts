import { Func } from '@faasjs/func';
import { Sql } from '@faasjs/sql';
import { Orders, Order } from './order';

const sql = new Sql({
  name: 'orders'
});

export default new Func({
  plugins: [sql],
  async handler () {
    const list: Order[] = await Orders(sql);

    return list;
  }
});
