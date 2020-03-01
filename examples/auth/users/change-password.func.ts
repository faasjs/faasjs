import { Func } from '@faasjs/func';
import { Sql } from '@faasjs/sql';
import { Http } from '@faasjs/http';

const sql = new Sql();
const http = new Http({
  validator: {
    session: {
      rules: {
        user_id: {
          required: true,
          type: 'number'
        }
      }
    },
    params: {
      whitelist: 'error',
      rules: {
        new_password: {
          required: true,
          type: 'string'
        },
        old_password: {
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
    const row = await sql.queryFirst('SELECT password FROM users WHERE id = ? LIMIT 1', [http.session.read('user_id')]);
    if (row.password !== http.params.old_password) {
      throw Error('旧密码错误');
    }
    await sql.query('UPDATE users SET password = ? WHERE id = ?', [http.params.new_password, http.session.read('user_id')]);
  }
});
