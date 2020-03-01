# Sql 插件

Sql 插件可以使云函数能够连接 SQL 数据库。

## 配置参数

需要通过 adapterType 来指定数据库类型，目前支持以下数据库类型：

### sqlite

基于 [sqlite3](https://www.npmjs.com/package/sqlite3)。

#### 配置参数

- **filename** `string` 文件名

### mysql

基于 [mysql](https://www.npmjs.com/package/mysql)。

#### 配置参数

- **host** `string` 主机地址，默认 `localhost`
- **port** `number` 端口号，默认 `3306`
- **user** `string` 登录用户名
- **password** `string` 登录密码
- **database** `string` 连接数据库名

### postgresql

基于 [pg](https://www.npmjs.com/package/pg)。

#### 配置参数

- **host** `string` 主机地址
- **port** `number` 端口号
- **user** `string` 登录用户名
- **password** `string` 登录密码
- **database** `string` 连接数据库名

## 实例方法

### query (sql: string, values?: any): Promise\<any\>

请求数据库

### queryMutli (sqls: string[]): Promise\<any[]\>

发出多条 Sql 请求

### queryFirst (sql: string, values?: any): Promise\<any\>

请求数据库并只返回第一条结果

## 示例代码

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

## Github 地址

[https://github.com/faasjs/faasjs/tree/master/packages/sql](https://github.com/faasjs/faasjs/tree/master/packages/sql)
