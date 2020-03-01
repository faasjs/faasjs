import { Func } from '@faasjs/func';
import { Sql } from '@faasjs/sql';
import { Orders } from './order';

const sql = new Sql({
  name: 'orders'
});

export default new Func({
  plugins: [sql],
  async handler () {
    return await Orders(sql).where({ id: 1 });
  }
});
