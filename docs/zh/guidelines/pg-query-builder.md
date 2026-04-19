# PG 查询构建指南

当你实现或评审 `@faasjs/pg` 查询代码时，默认优先使用 fluent `QueryBuilder`，而不是手写 SQL。

## 适用场景

- 创建或修改 `SELECT`、`INSERT`、`UPDATE`、`DELETE` 或 `UPSERT` 查询
- 增加 joins、排序、分页、聚合或 JSONB 字段选择
- 判断一个查询是否仍然可以留在 typed fluent API 内部
- 评审共享查询 helper 是否仍然返回最小且有用的结果行结构

## 默认工作流

1. 从 `client.query('<table>')` 开始。
2. 优先把查询保留在 `select`、`where`、`join`、`orderBy`、`limit` 与 `offset` 这些 builder 方法里。
3. 如果调用方不需要完整行，就用 `select(...)`、`first()` 或 `pluck(...)` 缩小结果。
4. 只有在 builder 无法直接表达时，才使用 `whereRaw`、`orWhereRaw` 或 `orderByRaw`。
5. 写操作要保留显式 `where` 条件，`returning` 也要尽量收窄。

## 最小示例

```ts
const rows = await client
  .query('users')
  .select('id', 'name', { column: 'metadata', fields: ['age'] })
  .leftJoin('profiles', 'users.id', 'profiles.user_id')
  .where('name', 'ILIKE', 'a%')
  .orderBy('id', 'ASC')
```

## 规则

### 1. 让查询结构和结果结构保持一致

- `select(...)`、`first()`、`pluck(...)` 与 `returning` 决定了下游代码可以安全依赖什么字段。
- 如果你抽出了共享查询 helper，就保持收窄后的结果结构显式存在，不要又放宽回整行。
- 如果你在为 `@faasjs/pg` 本身做贡献，运行时覆盖和类型覆盖要一起更新。

### 2. 先用 typed clauses，再考虑 raw SQL

- 优先使用 `where`、`orWhere`、`join`、`leftJoin`、`orderBy`、`count`、`first` 与 `pluck`。
- 相等、范围、数组、模式匹配与 JSONB containment 这些常见场景，优先用内建 operator。
- 只有像 `CASE`、SQL 函数，或无法自然映射到现有 API 的谓词，才使用 raw clauses。

### 3. raw fragments 也要参数化

- 运行时值仍然应该通过 placeholders 和 params 传入。
- `rawSql(...)` 只留给受信任的 SQL 片段或无法以其他方式表达的标识符。
- 永远不要把终端用户输入直接插进 raw SQL 字符串里。

### 4. 有意识地收窄结果结构

- 用 `select(...)` 避免拿到比实际需要更宽的行结构。
- 当调用方只需要 JSONB 字段的一部分时，使用 JSONB field selection。
- 单行用 `first()`，单列用 `pluck('<column>')`，写操作则用显式 `returning` 列表。

### 5. 让写查询始终有保护

- `update()` 和 `delete()` 应保留显式 `where` 条件。
- 除非那是明确的 migration 或运维动作，否则无界写操作都应该视为 bug。
- 不要移除或绕过包里已有的 missing-where protection。

### 6. 只有真正需要时才使用 `returning`

- `insert`、`update` 与 `upsert` 默认返回空结果结构，只有请求了 `returning` 才会返回变更行。
- 让 `returning` 保持显式，这样结果类型才会更窄、更稳定。
- 除非调用方真的需要整行，否则优先返回最小字段集合，而不是 `['*']`。

## 评审清单

- 是否先用了 builder 方法，再退回 raw SQL
- 结果结构是否和调用方真正读取的字段一致
- raw fragments 是否仍然通过参数传递运行时值
- 需要时是否通过 `select`、`first`、`pluck` 或显式 `returning` 收窄了结果
- `update` 与 `delete` 是否仍然被 `where` 保护
- 共享查询 helper 或包级改动是否同时保持了运行时与类型覆盖

## 延伸阅读

- [PG 原生 SQL 与 Client 指南](./pg-raw-sql-and-client.md)
- [PG 测试指南](./pg-testing.md)
- [@faasjs/pg package reference](/doc/pg/)
- [QueryBuilder](/doc/pg/classes/QueryBuilder.html)
- [Client](/doc/pg/classes/Client.html)
- [rawSql](/doc/pg/functions/rawSql.html)
