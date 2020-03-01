import { Func } from '@faasjs/func';
import { Sql } from '@faasjs/sql';
import { Http } from '@faasjs/http';

const sql = new Sql();
const http = new Http();

export default new Func({
  plugins: [sql, http],
  handler () {
    http.session.write('user_id', null);
  }
});
