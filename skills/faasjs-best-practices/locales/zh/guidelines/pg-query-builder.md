# PG 查询构建与原生 SQL 指南

当你实现或评审 `@faasjs/pg` 查询代码时，默认优先使用 fluent `QueryBuilder`，只有在 builder 无法清晰表达 SQL 时，才回退到 `client.raw(...)`。

## 适用场景

- 创建或修改 `SELECT`、`INSERT`、`UPDATE`、`DELETE` 或 `UPSERT` 查询
- 增加 joins、排序、分页、聚合、JSONB 字段选择或自定义谓词
- 判断查询是否可以继续停留在 typed fluent API 内，还是需要 raw SQL fragment
- 在 `getClient()` 与 `createClient(...)` 之间做选择，或评审 transaction 边界

## 默认工作流

1. 默认 client 路径优先使用 `await getClient()`。内建 bootstrap 会读取 `DATABASE_URL`，而测试可以按需懒加载地覆盖这条 bootstrap。
2. 从 `client.query('<table>')` 开始，能用 builder 方法表达的 `select`、`where`、`join`、`orderBy`、`limit`、`offset` 与 `returning` 都优先留在 builder 内。
3. 当调用方不需要整行数据时，用 `select(...)`、`first()`、`pluck(...)` 或显式 `returning` 列来收窄结果。
4. 只有当 builder 不能直接表达某个表达式或语句时，才使用 `whereRaw`、`orWhereRaw`、`orderByRaw` 或 `client.raw(...)`。
5. 运行时值始终保持参数化，`rawSql(...)` 与 `escapeIdentifier(...)` 只用于可信的 SQL fragments 或 identifiers。
6. 当原子性很重要时，用 `client.transaction(...)` 包裹多步读写流程。

## Builder 优先示例

```ts
const rows = await client
  .query('users')
  .select('id', 'name', { column: 'metadata', fields: ['age'] })
  .leftJoin('profiles', 'users.id', 'profiles.user_id')
  .where('name', 'ILIKE', 'a%')
  .orderBy('id', 'ASC')
```

## Raw SQL 回退示例

```ts
import { getClient } from '@faasjs/pg'

const client = await getClient()

await client.transaction(async (trx) => {
  await trx.raw('UPDATE users SET name = ? WHERE id = ?', 'Alice', 1)
  await trx.raw`INSERT INTO audit_logs (action, user_id) VALUES (${'rename_user'}, ${1})`
})
```

## 规则

### 1. 让查询结构和结果结构保持一致

- `select(...)`、`first()`、`pluck(...)` 与 `returning` 决定了下游代码可以安全假设什么。
- 如果你抽出了共享查询 helper，要让收窄后的结果结构保持显式，而不是重新放大回完整行。
- 如果你在给 `@faasjs/pg` 本身做贡献，运行时覆盖和类型覆盖要一起更新。

### 2. 在 raw SQL 之前优先 typed clauses

- 先使用 `where`、`orWhere`、`join`、`leftJoin`、`orderBy`、`count`、`first` 与 `pluck`。
- 对等值、范围、数组、模式匹配与 JSONB containment，优先使用内建 operators。
- 只有像 `CASE`、SQL functions、自定义 predicates，或内建 surface 难以表达的语句，才使用 raw clauses。

### 3. 保持 raw 值参数化，并让可信边界显式可见

- 运行时值统一通过 placeholders 或 template parameters 传入。
- `rawSql(...)` 只用于无法通过其他方式表达的可信 SQL fragments。
- SQL identifiers 不能参数化，所以要使用 `escapeIdentifier(...)`，或使用一个边界非常明确的可信 fragment。
- 永远不要把终端用户输入直接插值进 raw SQL 字符串。

### 4. 让不同环境下的数据库引导路径保持一致

- 默认应用 client 优先使用 `await getClient()`，让共享引导路径始终走注册过的异步 bootstrap。默认情况下，这条 bootstrap 读取 `process.env.DATABASE_URL`。
- 只有当你真的需要自定义 `postgres.js` options 或多连接时，才使用 `createClient(process.env.DATABASE_URL, options)`。
- 如果 `await getClient()` 抛错，应把它视为共享引导路径没有正确配置的信号。
- 在测试里，让 `PgVitestPlugin()` 负责注册懒加载的测试 bootstrap，不要再额外维护一条仅供测试使用的连接初始化路径。如果 suite 还要直接读取 `process.env.DATABASE_URL`，先调用一次 `await getClient()`。

### 5. 让写查询和事务边界保持保护条件

- `update()` 与 `delete()` 应该始终保留显式 `where` 条件。
- 除非是有意为之的 migration 或维护动作，否则无边界 mutation 应视为 bug。
- 不要移除或绕过包内置的 missing-where 保护。
- 对于必须一起成功或一起失败的多步 DML 或混合读写流程，使用 `client.transaction(...)`。

### 6. 只有在调用方需要变更后的行时才使用 `returning`

- `insert`、`update` 与 `upsert` 在没有请求 `returning` 时，会返回空的结果结构。
- 把 `returning` 列保持为显式列表，这样结果类型会更窄、更可预测。
- 除非调用方真的需要完整行，否则优先返回最小列集，而不是 `['*']`。

### 7. 把重复出现的 raw SQL 往共享 helper 或 builder 表达收敛

- 如果某段 raw query 变得常见或可复用，就评估它是否应该进入共享 helper 或 fluent query surface。
- 优先维护一个经过审查的抽象，而不是散落很多几乎重复的 raw SQL 片段。
- 当 `@faasjs/pg` 新增了能覆盖同类场景的 clause helper 后，及时把应用代码迁回 builder。

### 8. 有选择地使用 query logging

- client logger 是可选的。
- debug logging 适合用于查询耗时、问题排查或临时诊断。
- 不要让正常应用逻辑依赖 debug logging 的副作用。

## Review Checklist

- 在回退到 raw SQL 之前，优先使用了 builder methods
- 结果结构和调用方实际读取的字段一致
- 值仍然参数化，并且可信 SQL 边界足够显式
- 默认 client bootstrap 走的是 `await getClient()` 和注册过的异步 bootstrap（默认读取 `process.env.DATABASE_URL`）
- 在合适场景下使用了 `select`、`first`、`pluck` 或显式 `returning` 来收窄结果
- `update` 与 `delete` 仍然受 `where` 保护，多步写入在需要原子性时使用了 `transaction(...)`
- 共享查询 helper 或包内改动同时维护了运行时覆盖和类型覆盖

## 延伸阅读

- [PG 测试指南](./pg-testing.md)
- [PG 表类型指南](./pg-table-types.md)
- [@faasjs/pg package reference](/doc/pg/)
- [QueryBuilder](/doc/pg/classes/QueryBuilder.html)
- [Client](/doc/pg/classes/Client.html)
- [getClient](/doc/pg/functions/getClient.html)
- [createClient](/doc/pg/functions/createClient.html)
- [rawSql](/doc/pg/functions/rawSql.html)
- [escapeIdentifier](/doc/pg/functions/escapeIdentifier.html)
