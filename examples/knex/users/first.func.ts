import { Func } from '@faasjs/func';
import { Sql } from '@faasjs/sql';
import { Users } from './user';

const sql = new Sql({
  name: 'users'
});

export default new Func({
  plugins: [sql],
  async handler () {
    return await Users(sql).where({ id: 1 });
  }
});
