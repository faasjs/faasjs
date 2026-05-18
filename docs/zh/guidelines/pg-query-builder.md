# PG 查询构建器与原生 SQL 指南

在 FaasJS 应用中使用 `@faasjs/pg` 构建 SQL 查询时，请参考本指南。

## 适用场景

- 创建或修改 SELECT、INSERT、UPDATE、DELETE 或 UPSERT 查询
- 添加连接、排序、分页、聚合或 JSONB 字段选择
- 判断类型化的流式 API 是否足够，还是需要使用原生 SQL
- 在 `getClient` 和 `createClient` 之间选择

## 默认工作流

1. 优先使用 `await getClient()` 获取默认客户端路径。内置的引导程序读取 `DATABASE_URL`，测试可以惰性覆盖该引导程序。
2. 从 `client.query('<table>')` 开始，尽可能使用构建器方法中的 `select`、`where`、`join`、`orderBy`、`limit`、`offset` 和 `returning`。
3. 当调用方不需要完整行数据时，使用 `select(...)`、`first()`、`pluck(...)` 或显式的 `returning` 列来缩小结果范围。
4. 仅当构建器无法直接表示的表达式或语句时，才使用 `whereRaw`、`orWhereRaw`、`orderByRaw` 或 `client.raw(...)`。
5. 保持运行时值参数化，仅对可信的 SQL 片段或标识符使用 `rawSql(...)` 或 `escapeIdentifier(...)`。
6. 当原子性至关重要时，在多步骤读写流程中使用 `client.transaction(...)`。

## 构建器优先示例

```ts
const rows = await client
  .query('users')
  .select('id', 'name', { column: 'metadata', fields: ['age'] })
  .leftJoin('profiles', 'users.id', 'profiles.user_id')
  .where('name', 'ILIKE', 'a%')
  .orderBy('id', 'ASC')
```

## 原生 SQL 回退示例

```ts
import { getClient } from '@faasjs/pg'

const client = await getClient()

await client.transaction(async (trx) => {
  await trx.raw('UPDATE users SET name = ? WHERE id = ?', 'Alice', 1)
  await trx.raw`INSERT INTO audit_logs (action, user_id) VALUES (${'rename_user'}, ${1})`
})
```

## 规则

### 1. 保持查询形状与结果形状对齐

- `select(...)`、`first()`、`pluck(...)` 和 `returning` 定义了下游代码可以安全假设的内容。
- 如果提取了共享查询辅助函数，请保持缩小的结果形状显式，而不是将其扩展回完整行数据。
- 在为 `@faasjs/pg` 本身做贡献时，请同时更新运行时覆盖和类型覆盖。

### 2. 优先使用类型化子句，再考虑原生 SQL

- 优先使用 `where`、`orWhere`、`join`、`leftJoin`、`orderBy`、`count`、`first` 和 `pluck`。
- 优先使用内置操作符进行相等性、范围、数组、模式匹配和 JSONB 包含性检查。
- 仅当表达式（如 `CASE`、SQL 函数、谓词或语句）无法清晰映射到内置接口时，才使用原生子句。

### 3. 保持原生值参数化，并明确可信边界

- 使用占位符或模板参数表示运行时值。
- `rawSql(...)` 应保留给无法以其他方式表示的可信 SQL 片段。
- SQL 标识符不能参数化，因此使用 `escapeIdentifier(...)` 或经过仔细限定的可信片段。
- 切勿将最终用户的值直接插入到原生 SQL 字符串中。

### 4. 保持数据库引导程序跨环境一致

- 优先使用 `await getClient()` 获取默认应用客户端，以便共享引导路径始终通过注册的异步引导程序。默认情况下，该引导程序读取 `process.env.DATABASE_URL`。
- 仅当需要自定义 `postgres.js` 选项或多个数据库连接时，才使用 `createClient(process.env.DATABASE_URL, options)`。
- 将 `await getClient()` 抛出异常视为共享引导路径未配置的信号。
- 在测试中，让 `PgVitestPlugin()` 注册惰性测试引导程序，而不是构建单独的仅用于测试的连接路径。如果测试套件也直接读取 `process.env.DATABASE_URL`，请先调用 `await getClient()`。

### 5. 保持写入查询和事务受保护

- `update()` 和 `delete()` 应保留显式的 `where` 条件。
- 除非是有意的迁移或维护操作，否则将无界限的修改视为错误。
- 不要移除或绕过包中的缺少 `where` 保护机制。
- 对于多步骤 DML 或必须同时成功或失败的混合读写流程，使用 `client.transaction(...)`。

### 6. 仅在调用方需要已变更的行时才使用 `returning`

- 除非请求了 `returning`，否则 `insert`、`update` 和 `upsert` 返回空结果形状。
- 保持 `returning` 列显式，以便结果类型保持狭窄和可预测。
- 优先使用最小返回列集，而不是 `['*']`，除非调用方确实需要整行数据。

### 7. 将重复的原生 SQL 移回共享辅助函数或构建器

- 如果某个原生查询变得常见或可复用，请考虑它是否适合放在共享辅助函数或流式查询接口中。
- 优先使用一个经过审查的抽象，而不是多个高度重复的原生 SQL 片段。
- 当 `@faasjs/pg` 增加了覆盖相同场景的子句辅助函数时，更新应用代码以放弃原生 SQL。

### 8. 有选择地使用查询日志

- 客户端日志记录器是可选的。
- 调试日志适用于查询计时、故障排查或临时诊断。
- 避免将正常应用逻辑耦合到调试日志的副作用上。

## 审查清单

- 在回退到原生 SQL 之前，已优先使用构建器方法
- 结果形状与调用方实际读取的内容匹配
- 值保持参数化，可信 SQL 边界明确
- 默认客户端引导程序使用 `await getClient()` 和已注册的异步引导程序（默认为 `process.env.DATABASE_URL`）
- 在适当的情况下使用 `select`、`first`、`pluck` 或显式的 `returning` 来缩小行数据
- `update` 和 `delete` 由 `where` 保护，当原子性至关重要时，多步骤写入使用 `transaction(...)`
- 共享查询辅助函数或包变更保持运行时覆盖和类型覆盖一致

## 延伸阅读

- [PG 测试指南](./pg-testing.md)
- [PG 表类型指南](./pg-table-types.md)
- [@faasjs/pg 包参考](/doc/pg/)
- [QueryBuilder](/doc/pg/classes/QueryBuilder.html)
- [Client](/doc/pg/classes/Client.html)
- [getClient](/doc/pg/functions/getClient.html)
- [createClient](/doc/pg/functions/createClient.html)
