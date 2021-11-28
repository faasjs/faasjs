# 数据库操作

数据库插件没有内置在 `faasjs` 中，使用前需自行安装依赖。

FaasJS 目前提供了三个数据库插件：

- **@faasjs/knex** 基于 Knex 封装的云函数插件。
- **@faasjs/redis** 支持 Redis。
- **@faasjs/mongo** 支持 MongoDB。

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

## MongoDB 操作示例

```typescript
import { Func } from '@faasjs/func';
import { Mongo } from '@faasjs/mongo';

const mongo = new Mongo();

export default new Func({
  plugins: [mongo], // 将实例放到云函数的插件中
  async handler(){
    return await mongo.collection('test').find().toArray(); // 查询数据库
  }
});
```
