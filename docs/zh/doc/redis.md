# @faasjs/redis

Redis 插件可以使云函数能够连接 Redis 数据库。

基于 [redis](https://www.npmjs.com/package/redis)。

## 配置参数

- **host** `string` 主机地址
- **port** `number` 端口号
- **password** `string` 登录密码
- **prefix** `string` 前缀

## 实例方法

### query(command: string, args: any[]): Promise\<any\>

请求 Redis

## 示例代码

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

## Github 地址

[https://github.com/faasjs/faasjs/tree/main/packages/redis](https://github.com/faasjs/faasjs/tree/main/packages/redis)
