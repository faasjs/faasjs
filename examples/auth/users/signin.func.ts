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
    const row = await sql.queryFirst('SELECT id,password FROM users WHERE username = ? LIMIT 1', [http.params.username]);
    if (!row) {
      throw Error('用户名错误');
    }
    if (row.password !== http.params.password) {
      throw Error('用户名或密码错误');
    }

    http.session.write('user_id', row.id);
  }
});
