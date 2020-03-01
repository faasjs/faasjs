import { Func } from '@faasjs/func';
import { Sql } from '@faasjs/sql';
import { Http } from '@faasjs/http';

const sql = new Sql();
const http = new Http({
  validator: {
    params: {
      whitelist: 'error',
      rules: {
        username: {
          required: true,
          type: 'string'
        },
        password: {
          required: true,
          type: 'string'
        }
      }
    }
  }
});

export default new Func({
  plugins: [sql, http],
  async handler () {
    await sql.query('INSERT INTO users (username,password) VALUES (?, ?)', [http.params.username, http.params.password]);

    const row = await sql.queryFirst('SELECT id FROM users WHERE username = ? LIMIT 1', [http.params.username]);

    http.session.write('user_id', row.id);
  }
});
