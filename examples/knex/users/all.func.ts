import { Func } from '@faasjs/func';
import { Sql } from '@faasjs/sql';
import { Users, User } from './user';

const sql = new Sql({
  name: 'users'
});

export default new Func({
  plugins: [sql],
  async handler () {
    const list: User[] = await Users(sql);

    return list;
  }
});
