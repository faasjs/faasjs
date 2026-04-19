# PG Schema 与迁移指南

当你用 `@faasjs/pg` 实现或评审 DDL 时，默认优先使用 `SchemaBuilder`、`TableBuilder` 与基于时间戳的 migration files。

## 适用场景

- 创建或修改 migrations
- 变更 tables、columns、indexes 或 constraints
- 判断一个 schema change 应该使用 builder helpers，还是必须使用 raw SQL
- 评审应用级 schema change 的回滚预期

## 默认工作流

1. 先创建一个带时间戳的 `.ts` migration file，通常通过 `faasjs-pg new <name>`。
2. 先用 `SchemaBuilder` 与 `TableBuilder` helpers 实现 `up(builder)`。
3. 在可行时实现 `down(builder)` 用于回滚。
4. 把相关 DDL 保持在同一次 builder run 里，以维持事务性。
5. 只有在现有 helpers 不支持时，才回退到 `raw()`。

## 最小示例

```ts
import type { SchemaBuilder } from '@faasjs/pg'

export function up(builder: SchemaBuilder) {
  builder.createTable('users', (table) => {
    table.string('id').primary()
    table.string('name')
    table.jsonb('metadata').defaultTo('{}')
    table.timestamps()
    table.index('name')
  })
}

export function down(builder: SchemaBuilder) {
  builder.dropTable('users')
}
```

## 规则

### 1. 让 migration filenames 保持可按字典序排序

- migration files 应保持基于时间戳，并且能按文件名排序。
- 除非有很强的理由，否则优先使用 `faasjs-pg new <name>` 生成的命名模式。
- 避免会破坏字典序的自定义命名方案。

### 2. 优先使用 builder helpers，而不是手写 DDL

- 优先使用 `createTable`、`alterTable`、`renameTable`、`dropTable` 和 `TableBuilder` 的列 helpers。
- 当 schema 需要内建 helper 不支持的 PostgreSQL 类型时，再使用 `specificType(...)`。
- raw DDL 只用于不被支持的特性，或边界清晰的一次性语句。

### 3. 保持 schema 执行的事务语义

- `SchemaBuilder.run()` 会在同一个事务里执行累积的 statements。
- 编写 migration 时要假设这批变更应该整体成功或整体失败。
- 除非你明确需要部分应用，否则不要把一个逻辑上的 schema 变更拆到多个无关的 builder runs 里。

### 4. 让 migrations 可预测、可回滚

- `up` 和 `down` 应该直接、可读地描述 schema transition。
- 除非确有必要，避免在 migration 里写依赖时间或环境的 SQL。
- 在可行时优先可逆变更，这样 `down()` 才能恢复旧状态。

### 5. 保持 migration history 语义稳定

- `typed_pg_migrations` 是 migration history 的来源。
- `migrate()` 会执行所有 pending files，`up()` 执行下一个 pending file，`down()` 回滚最近一次已记录的 file。
- 对 app code、tooling 与问题排查来说，都把这套行为当作默认心智模型。

## 评审清单

- migration file name 是否仍然按时间戳排序
- 在可回滚时，`up` 与 `down` 是否都已存在
- 是否先用了 builder helpers，再退回 raw DDL
- schema changes 是否依赖 `SchemaBuilder.run()` 的原子性
- 高风险 schema changes 是否有聚焦的 migration 或 integration tests 覆盖

## 延伸阅读

- [PG 测试指南](./pg-testing.md)
- [@faasjs/pg package reference](/doc/pg/)
- [SchemaBuilder](/doc/pg/classes/SchemaBuilder.html)
- [TableBuilder](/doc/pg/classes/TableBuilder.html)
- [Migrator](/doc/pg/classes/Migrator.html)
- [Client](/doc/pg/classes/Client.html)
