# PG 测试指南

在 FaasJS 项目中编写或审查使用 `@faasjs/pg` 或 `@faasjs/pg-dev` 的测试时，请参考本指南。

## 适用场景

- 在应用代码中添加或修改查询构建器的使用
- 修改共享查询辅助函数、仓库包装器或表类型
- 更新模式或迁移辅助函数
- 为 `@faasjs/pg` 或 `@faasjs/pg-dev` 编写集成测试

## 默认工作流

1. 优先使用 `PgVitestPlugin()`，以便 Vitest 注册一个惰性临时数据库引导程序，在首次 `await getClient()` 时启动 PGlite，运行迁移，回填 `DATABASE_URL`，并在同一文件中的后续测试之前清除表内容。在混合工作区中，将基于 PG 的测试保留在 Node 项目中，因为该插件会跳过 `jsdom` 和 `happy-dom` 项目。
2. 使用 `await getClient()` 来填充数据和运行断言，以便应用代码和测试共享相同的异步引导路径。
3. 仅添加插件尚未提供的特定于套件的设置或夹具。
4. 当查询推断、声明合并或共享包装器影响类型时，将运行时断言与 `expectTypeOf(...)` 配对使用。
5. 运行与变更范围匹配的最小验证命令。

混合工作区示例：

```ts
import { PgVitestPlugin } from '@faasjs/pg-dev'
import { defineConfig } from 'vite-plus'

export default defineConfig({
  plugins: [PgVitestPlugin()],
  test: {
    projects: [
      {
        extends: true as const,
        test: {
          name: 'node',
          include: ['src/**/*.test.ts'],
          exclude: ['src/**/*.types.test.ts'],
          environment: 'node',
        },
      },
      {
        extends: true as const,
        test: {
          name: 'ui',
          include: ['src/**/*.test.tsx', 'src/**/*.ui.test.ts'],
          environment: 'jsdom',
        },
      },
    ],
  },
})
```

## 最小示例

```ts
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import { PgVitestPlugin } from '@faasjs/pg-dev'

export default defineConfig({
  plugins: [PgVitestPlugin()],
})
```

```ts
import { describe, expect, it } from 'vitest'

import { getClient } from '@faasjs/pg'

async function seedUser() {
  const client = await getClient()

  await client.query('users').insert({
    id: 1,
    name: 'Alice',
  })
}

describe('users query', () => {
  it('selects seeded rows', async () => {
    const client = await getClient()

    await seedUser()

    await expect(client.query('users').where('id', 1)).resolves.toMatchObject([{ name: 'Alice' }])
  })
})
```

## 规则

### 1. 每个行为变更都需要测试更新

- 为每个运行时行为变更添加新测试或更新现有测试。
- 优先在您更改的特性或查询辅助函数附近编写有针对性的测试，而不是编写宽泛的通用测试套件。
- 测试调用方所依赖的数据库行为，而不是私有的实现细节。

### 2. 类型敏感的变更需要 `expectTypeOf(...)`

- 在更改推断、重载、声明合并或共享包装器时，添加或更新类型断言。
- 如果查询构建器方法或辅助函数改变了结果形状，直接测试推断出的结果类型。
- 当变更同时影响运行时和类型时，保持运行时覆盖和类型覆盖一致。

### 3. 保持测试紧邻它们所保护的特性

- 将查询测试放在拥有该查询的仓库或辅助函数层附近。
- 将模式或迁移测试放在它们所验证的迁移工具或设置附近。
- 将共享测试引导程序放在 Vitest 配置或其他测试支持代码附近。
- 如果您为 `@faasjs/pg` 本身做贡献，请遵循该包中已有的特性区域测试布局。

### 4. 即使插件重置数据，也要保持测试隔离

- 优先使用 `PgVitestPlugin()` 在每个测试之前自动重置行数据。
- 当测试套件超出默认迁移范围时，显式创建额外的表、填充数据或临时文件夹。
- 不要依赖来自另一个测试文件或用例的隐藏状态。

### 5. 通过 Vitest 插件使用 `@faasjs/pg-dev`

- 优先使用 `PgVitestPlugin()` 进行工作区测试运行。
- 基于 PG 的运行时测试仍然是 Node 运行时测试。优先使用常规的 `node` 项目，但如果只有该子集需要项目级设置，请使用 Node 范围的项目名称，例如 `node-pg`，而不是独立的运行时存储桶，如 `pg`。
- 在测试中，让插件通过 `await getClient()` 惰性引导默认客户端。如果测试套件也直接读取 `process.env.DATABASE_URL`，请先使用 `await getClient()` 触发引导。
- 仅当测试套件确实需要自定义 `postgres.js` 选项或在引导 URL 存在后的额外连接时，才使用 `createClient(process.env.DATABASE_URL, options)`。
- 将较低级别的数据库引导逻辑保留在测试支持层内部；公开示例应仅展示插件。

## 审查清单

- 运行时行为变更已通过测试覆盖
- 类型敏感的变更已通过 `expectTypeOf(...)` 覆盖
- 测试位于变更的特性区域附近
- 混合工作区将基于 PG 的测试保留在 Node 项目中，因为类似浏览器的项目会被跳过
- 基于 PG 的运行时测试在混合工作区中保持在 Node 范围的项目（`node` 或 `node-pg`）中
- 测试套件要么依赖插件重置，要么自行清理其额外设置
- 验证命令与变更范围匹配

## 延伸阅读

- [PG 查询构建器与原生 SQL 指南](./pg-query-builder.md)
- [PG 模式与迁移指南](./pg-schema-and-migrations.md)
- [@faasjs/pg 包参考](/doc/pg/)
- [@faasjs/pg-dev 包参考](/doc/pg-dev/)
- [PgVitestPlugin](/doc/pg-dev/functions/PgVitestPlugin.html)
- [setupPgVitest](/doc/pg-dev/functions/setupPgVitest.html)
- [getClient](/doc/pg/functions/getClient.html)
