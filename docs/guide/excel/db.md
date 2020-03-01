# 数据库操作

FaasJS 目前提供了 `@faasjs/sql` 和 `@faasjs/redis` 来支持数据库操作，其中 `@faasjs/sql` 支持 `Sqlite`、`Mysql` 和 `PostgreSQL`。

## Sql 数据库操作示例

```typescript
import { Func } from '@faasjs/func';
import { Sql } from '@faasjs/sql';

const sql = new Sql();

export default new Func({
  plugins: [sql], // 将实例放到云函数的插件中
  async handler(){
    return await sql.query('SELECT 1+1'); // 查询数据库
  }
});
```

详细文档见 [Sql 插件](/doc/sql.html)。

## Redis 数据库操作示例

```typescript
import { Func } from '@faasjs/func';
import { Redis } from '@faasjs/redis';

const redis = new Redis();

export default new Func({
  plugins: [redis], // 将实例放到云函数的插件中
  async handler(){
    return await redis.query('get', ['key']); // 查询数据库
  }
});
```

详细文档见 [Redis 插件](/doc/redis.html)。
