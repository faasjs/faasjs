# PG 模式与迁移指南

在使用 `@faasjs/pg` 创建或审查数据库模式变更、迁移或表结构时，请参考本指南。

## 适用场景

- 创建或修改迁移
- 变更表、列、索引或约束
- 判断模式变更应使用构建器辅助函数还是原生 SQL
- 审查回滚预期

## 默认工作流

1. 创建一个带时间戳的 `.ts` 迁移文件，通常使用 `faasjs-pg new <name>`。
2. 首先使用 `SchemaBuilder` 和 `TableBuilder` 辅助函数实现 `up(builder)`。
3. 在实际可行的情况下实现 `down(builder)` 以便回滚。
4. 从项目根目录运行 `faasjs-pg status` 检查迁移历史，然后根据需要的执行路径使用 `faasjs-pg migrate`、`faasjs-pg up` 或 `faasjs-pg down`。
5. 将迁移文件保留在 `src/db/migrations` 目录下，除非有意重新配置工具，因为 CLI 和 `PgVitestPlugin()` 默认都在该目录中查找。
6. 将相关的 DDL 放在一次构建器运行中，以保持事务性。
7. 仅当当前辅助函数不支持的 SQL 时才回退到 `raw()`。

## 最小示例

```ts
import type { SchemaBuilder } from '@faasjs/pg'

export function up(builder: SchemaBuilder) {
  builder.createTable('users', (table) => {
    table.number('id').primary()
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

### 1. 保持迁移文件名按字典序可排序

- 迁移文件应保持基于时间戳且按文件名可排序。
- 除非有强有力的理由，否则优先使用生成的 `faasjs-pg new <name>` 命名模式。
- 避免使用破坏字典序的自定义命名方案。

### 2. 优先使用构建器辅助函数而非手写 DDL

- 首先使用 `createTable`、`alterTable`、`renameTable`、`dropTable` 和 `TableBuilder` 列辅助函数。
- 当模式需要内置辅助函数未覆盖的 PostgreSQL 类型时，使用 `specificType(...)`。
- 仅对不支持的功能或经过仔细限定的一次性语句使用原生 DDL。

### 3. 保持事务性模式执行

- `SchemaBuilder.run()` 在单个事务中执行累积的语句。
- 编写迁移时，假设批量操作应作为一个单元全部成功或全部失败。
- 除非有意进行部分应用，否则不要将一个逻辑模式变更分散到无关的构建器运行中。

### 4. 保持迁移确定性和可逆性

- `up` 和 `down` 应是对模式转换的直接、可读的描述。
- 除非明确需要，否则避免在迁移中使用时间敏感或环境敏感的 SQL。
- 不要在迁移中使用防御性的 `IF EXISTS` 或 `IF NOT EXISTS` DDL 子句；让意外的模式状态立即失败，以便在迁移过程中发现漂移。
- 在实际可行的情况下优先使用可逆的变更，以便 `down()` 能够恢复之前的状态。

### 5. 保持迁移历史语义稳定

- `faasjs_pg_migrations` 是迁移历史的来源。
- `migrate()` 应用所有待处理的文件，`up()` 应用下一个待处理的文件，`down()` 回滚最新记录的文件。
- 将这些行为视为应用代码、工具和故障排查的默认心智模型。

### 6. 保持执行路径清晰

- 除非项目工具另有配置，否则将迁移文件保留在项目根目录的 `src/db/migrations` 文件夹中。
- 使用 `faasjs-pg status` 检查历史记录，`faasjs-pg migrate` 应用所有待处理的文件，`faasjs-pg up` 应用下一个文件，`faasjs-pg down` 进行最新回滚。
- 如果项目自定义了文件夹或包装命令，请在项目 README 或贡献者指南中明确记录该覆盖。

## 审查清单

- 迁移文件名保持按时间戳排序
- 当回滚实际可行时，`up` 和 `down` 都存在
- 项目的 `status`/`migrate`/`up`/`down` 执行流程清晰
- 在使用原生 DDL 之前已优先使用构建器辅助函数
- 原生 DDL 没有使用 `IF EXISTS` 或 `IF NOT EXISTS` 隐藏漂移
- 模式变更预期 `SchemaBuilder.run()` 具有原子性
- 风险较高的模式变更通过针对性的迁移或集成测试覆盖

## 延伸阅读

- [PG 测试指南](./pg-testing.md)
- [@faasjs/pg 包参考](/doc/pg/)
- [SchemaBuilder](/doc/pg/classes/SchemaBuilder.html)
- [TableBuilder](/doc/pg/classes/TableBuilder.html)
- [Migrator](/doc/pg/classes/Migrator.html)
- [Client](/doc/pg/classes/Client.html)
