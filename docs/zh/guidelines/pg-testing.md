# PG 测试指南

当你修改基于 `@faasjs/pg` 的代码时，每一个行为变化都应该配套 runtime tests，而类型敏感的 surface 变化则应该配套 `expectTypeOf(...)` 覆盖。

## 适用场景

- 在应用代码里新增或修改 query-builder 用法
- 修改共享查询 helpers、repository wrappers 或 table typing
- 更新 schema 或 migration helpers
- 为 `@faasjs/pg` 或 `@faasjs/pg-dev` 编写 integration tests

## 默认工作流

1. 优先使用 `TypedPgVitestPlugin()`，让 Vitest 自动启动临时数据库、在开启 file parallelism 时为每个 worker 分配一个数据库、运行 migrations，并在每个测试前清空表数据。混合工作区里要记住：它默认会跳过 `jsdom` 和 `happy-dom` 项目，除非你通过 `environments` 或 `projects` 显式启用。
2. 让 `TypedPgVitestPlugin()` 注入 `DATABASE_URL`，然后用 `getClient()` 做 seed 和断言，让应用代码与测试共享同一条连接 bootstrap 路径。
3. 只补充该 suite 真正额外需要的 setup 或 fixtures。
4. 当查询推导、declaration merging 或共享 wrappers 影响类型时，让 runtime assertions 和 `expectTypeOf(...)` 成对出现。
5. 运行与变更面最匹配的最小验证命令。

## 最小示例

```ts
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import { TypedPgVitestPlugin } from '@faasjs/pg-dev'

export default defineConfig({
  plugins: [TypedPgVitestPlugin()],
})
```

```ts
import { describe, expect, it } from 'vitest'

import { getClient } from '@faasjs/pg'

async function seedUser() {
  await getClient().query('users').insert({
    id: 1,
    name: 'Alice',
  })
}

describe('users query', () => {
  it('selects seeded rows', async () => {
    const client = getClient()

    await seedUser()

    await expect(client.query('users').where('id', 1)).resolves.toMatchObject([{ name: 'Alice' }])
  })
})
```

## 规则

### 1. 每个行为变化都需要更新测试

- 每一个运行时行为变化都应该新增测试，或更新已有测试。
- 优先写贴近你改动查询 helper 或功能点的聚焦测试，而不是大而全的兜底 suite。
- 测试的是调用方真正依赖的数据库行为，而不是私有实现细节。

### 2. 类型敏感变更需要 `expectTypeOf(...)`

- 当 inference、overloads、declaration merging 或共享 wrappers 发生变化时，补上或更新类型断言。
- 如果某个 query-builder 方法或 helper 改变了结果结构，就直接测试推导出的结果类型。
- 当一个改动同时影响运行时和类型时，两类覆盖要保持同步。

### 3. 让测试贴近它保护的功能区域

- 查询测试放在拥有该查询的 repository 或 helper 附近。
- schema 或 migration 测试放在对应 migration utilities 或 setup 附近。
- 共享测试引导放在 Vitest 配置或其他 test support code 附近。
- 如果你在给 `@faasjs/pg` 本身做贡献，遵循包里现有的 feature-area test layout。

### 4. 即使插件会重置数据，测试也要保持隔离

- 优先依赖 `TypedPgVitestPlugin()` 在每个测试前自动重置表数据。
- 当某个 suite 超出默认 migrations 范围时，额外的 tables、seed data 或 temp folders 都要显式创建。
- 不要依赖另一个测试文件或 case 留下的隐式状态。

### 5. 通过 Vitest plugin 使用 `@faasjs/pg-dev`

- 工作区测试默认优先使用 `TypedPgVitestPlugin()`。
- 在混合 Vitest 工作区里，如果 `jsdom` 或 `happy-dom` suites 也要接入插件，就显式传 `environments` 或 `projects`。
- 测试里让插件注入 `DATABASE_URL`，然后直接使用 `getClient()` 做 fixtures 与断言。
- 只有在某个 suite 真的需要自定义 `postgres.js` options 或额外连接时，才使用 `createClient(process.env.DATABASE_URL, options)`。
- 更底层的数据库 bootstrap 细节应留在 test support layer 内部，公开示例只展示插件用法。

## 评审清单

- runtime behavior changes 是否有测试覆盖
- 类型敏感变更是否有 `expectTypeOf(...)` 覆盖
- 测试是否放在变更对应的功能区域附近
- 混合工作区是否在需要浏览器类项目时显式配置了插件范围
- suites 是否依赖了插件重置，或自行清理了额外 setup
- 验证命令是否与变更面匹配

## 延伸阅读

- [PG 查询构建指南](./pg-query-builder.md)
- [PG Schema 与迁移指南](./pg-schema-and-migrations.md)
- [@faasjs/pg-dev package reference](/doc/pg-dev/)
- [TypedPgVitestPlugin](/doc/pg-dev/functions/TypedPgVitestPlugin.html)
- [setupTypedPgVitest](/doc/pg-dev/functions/setupTypedPgVitest.html)
- [getClient](/doc/pg/functions/getClient.html)
