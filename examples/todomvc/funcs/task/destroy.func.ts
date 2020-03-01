import { Func } from '@faasjs/func';
import { Http } from '@faasjs/http';
import { Sql } from '@faasjs/sql';

const http = new Http({
  validator: {
    params: {
      whitelist: 'error',
      rules: {
        id: {
          required: true,
          type: 'number'
        }
      }
    }
  }
});

const sql = new Sql();

export default new Func({
  plugins: [http, sql],
  async handler() {
    return await sql.query('DELETE FROM tasks WHERE id = ?', [http.params.id]);
  }
});
