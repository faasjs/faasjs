# 集成 Knex 来简化 Sql 查询

### user.ts

```typescript
import knex from 'knex';
import { Sql } from '@faasjs/sql';

export interface User {
  id: string;
  name: string;
  created_at: number;
}

export function CreateUsers (sql: Sql) {
  return knex<User>({
    client: sql.adapterType
  }).schema.connection(sql.adapter!.pool).dropTableIfExists('users').createTable('users', function (t) {
    t.string('id').notNullable();
    t.string('name').notNullable();
    t.integer('created_at').notNullable();
  });
}

export function Users (sql: Sql) {
  return knex<User>({
    client: sql.adapterType
  }).from('users').connection(sql.adapter!.pool);
}
```

### me.func.ts

```typescript
import { Func } from '@faasjs/func';
import { Http } from '@faasjs/http';
import { Sql } from '@faasjs/sql';
import { Users, User } from './user';

const http = new Http({
  validator: {
    session: {
      rules: {
        user_id: {
          required: true
        }
      }
    }
  }
});

const db = new Sql();

export default new Func({
  plugins: [http, db],
  async handler () {
    const me: User = await Users(db).where({ id: http.session.read('user_id') }).first();

    return {
      id: me.id
      name: me.name
    };
  }
});
```
