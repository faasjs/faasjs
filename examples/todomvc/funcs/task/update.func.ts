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
        },
        name: {
          type: 'string'
        },
        completed: {
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
    if (http.params.name) {
      await sql.query('UPDATE tasks SET name = ? WHERE id = ?', [http.params.name, http.params.id]);
    }

    if (typeof http.params.completed !== 'undefined') {
      await sql.query('UPDATE tasks SET completed = ? WHERE id = ?', [http.params.completed, http.params.id]);
    }
  }
});
