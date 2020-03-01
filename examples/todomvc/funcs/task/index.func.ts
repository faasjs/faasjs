import { Func } from '@faasjs/func';
import { Http } from '@faasjs/http';
import { Sql } from '@faasjs/sql';

const http = new Http();
const sql = new Sql();

export default new Func({
  plugins: [http, sql],
  async handler() {
    return await sql.query('SELECT * FROM tasks');
  }
});
