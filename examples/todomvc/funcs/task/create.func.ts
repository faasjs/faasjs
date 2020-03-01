import { Func } from '@faasjs/func';
import { Http } from '@faasjs/http';
import { Sql } from '@faasjs/sql';

const http = new Http({
  validator: {
    params: {
      whitelist: 'error',
      rules: {
        name: {
          required: true,
          type: 'string'
        }
      }
    }
  }
});

const sql = new Sql();

export default new Func({
  plugins: [http, sql],
  async handler() {
    return await sql.query('INSERT INTO tasks (name) VALUES (?)', [http.params.name]);
  }
});
