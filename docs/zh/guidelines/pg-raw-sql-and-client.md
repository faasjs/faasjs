# PG 原生 SQL 与 Client 指南

当 `@faasjs/pg` 需要写 fluent builder 之外的 SQL 时，默认使用带参数的 `client.raw(...)`，并且只在明确场景下使用 raw fragments。

## 适用场景

- 编写 `client.raw(...)` 查询
- 在 `getClient()` 和 `createClient(...)` 之间做选择
- 构建 builder 无法直接表达的自定义 joins、predicates 或 schema 语句
- 评审 query logging 或 transaction 边界

## 默认工作流

1. 在环境里设置 `DATABASE_URL`，默认优先使用 `getClient()`，让应用代码和测试共享同一条 bootstrap 路径。
2. 如果 fluent API 已经支持该查询，优先使用 `client.query(...)`。
3. 自定义 SQL 使用 tagged template strings 或 `?` placeholders 形式的 `client.raw(...)`。
4. 只有当标识符或 SQL 片段无法参数化时，才使用 `escapeIdentifier(...)` 或 `rawSql(...)`。
5. 多步数据修改放进 `client.transaction(...)`。

## 最小示例

```ts
import { getClient } from '@faasjs/pg'

const client = getClient()

await client.transaction(async (trx) => {
  await trx.raw('UPDATE users SET name = ? WHERE id = ?', 'Alice', 1)
  await trx.raw`INSERT INTO audit_logs (action, user_id) VALUES (${'rename_user'}, ${1})`
})
```

## 规则

### 1. 默认对值做参数化

- 运行时值使用 placeholders 或 template parameters 传入。
- 优先选择 builder helpers 或 `client.raw(...)`，不要手工字符串拼接。
- 除非输入是受信任的静态字面量，否则把值直接插进 SQL 字符串应视为 bug。

### 2. 在不同环境里保持一致的数据库引导方式

- 默认应用 client 优先使用 `getClient()`，让共享 bootstrap 路径始终依赖 `process.env.DATABASE_URL`。
- 只有当你真的需要自定义 `postgres.js` options 或多连接时，才使用 `createClient(process.env.DATABASE_URL, options)`。
- `getClient()` 抛错通常意味着共享 bootstrap 路径没有配置好。
- 在测试里，让 `TypedPgVitestPlugin()` 注入 `DATABASE_URL`，而不是另建一套只给测试用的连接路径。

### 3. 显式处理标识符和 raw fragments

- SQL 标识符不能参数化，所以要使用 `escapeIdentifier(...)`，或者使用边界非常清晰的 `rawSql(...)` 片段。
- `rawSql(...)` 只适用于受信任 SQL，不能包裹不受信任的用户输入。
- 让这段“受信任边界”在代码评审里足够小、足够明显。

### 4. 选择正确的事务边界

- 多步 DML 或读写混合流程使用 `client.transaction(...)`。
- 由 schema helpers 生成的批量 DDL 使用 `SchemaBuilder.run()`。
- 在代码和测试里都要把 all-or-nothing 行为写清楚。

### 5. 有选择地打开 query logging

- client logger 是可选能力。
- debug logging 适合查询耗时排查、问题定位或临时诊断。
- 不要让正常业务逻辑依赖 debug logging 的副作用。

### 6. 把重复 raw SQL 往共享 helper 或 builder 收敛

- 如果某段 raw 查询开始频繁复用，就评估它是否应该变成共享 helper，甚至进入 fluent query surface。
- 与其维护很多相似的 raw SQL 片段，不如维护一个经过评审的抽象。
- 当 `@faasjs/pg` 已经提供能覆盖该场景的新 helper 后，及时把应用代码迁回 typed API。

## 评审清单

- 值是否都经过参数化
- 默认 client bootstrap 是否通过 `getClient()` 与 `process.env.DATABASE_URL`
- 标识符或 SQL 片段是否已经 escape，或者明确属于受信任内容
- raw SQL 是否只用于 builder 确实无法覆盖的场景
- 需要原子性时，多步写操作是否用了 `transaction(...)`
- debug logging 变更是否不会影响正常运行时行为

## 延伸阅读

- [PG 查询构建指南](./pg-query-builder.md)
- [PG 测试指南](./pg-testing.md)
- [Client](/doc/pg/classes/Client.html)
- [getClient](/doc/pg/functions/getClient.html)
- [createClient](/doc/pg/functions/createClient.html)
- [rawSql](/doc/pg/functions/rawSql.html)
- [escapeIdentifier](/doc/pg/functions/escapeIdentifier.html)
