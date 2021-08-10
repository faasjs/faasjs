# 集成 Knex 来简化 Sql 查询

### me.func.ts

```typescript
import { useFunc } from '@faasjs/func';
import { useHttp } from '@faasjs/http';
import { useKnex } from '@faasjs/knex';

declare module 'knex/types/tables' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface Tables {
    users: {
      id: string;
      name: string;
      created_at: number;
    }
  }
}

export default useFunc(function () {
  const http = useHttp({
    validator: {
      session: {
        rules: {
          user_id: {
            required: true
          }
        }
      }
    }
  })

  const knex = useKnex()

  return async function () {
    const me = await knex.query('users').where({ id: http.session.read('user_id') }).first();

    return {
      id: me.id
      name: me.name
    };
  }
});
```
