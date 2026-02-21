# 数据库操作

Knex 能力已内置在 `@faasjs/core` 中，但数据库驱动需按实际 client 自行安装。

- **@faasjs/core** 提供基于 Knex 封装的云函数插件能力。
  - `client: pg`：使用 PostgreSQL（需自行安装 `pg`）。
  - `client: pglite`：使用 PGlite（需自行安装 `@electric-sql/pglite` 与 `knex-pglite`，并使用字符串 `connection`）。
    - 未配置 `connection` 时默认使用内存数据库。
    - `pool` 配置会被忽略（PGlite 单连接）。
    - 使用目录连接时会自动创建父目录。

## Migration

- `@faasjs/core` 提供 `KnexSchema`，用于显式执行 migration。
- 推荐在测试 setup 或部署脚本中执行 migration，不建议放在请求链路自动执行。

### CLI（推荐）

安装 `@faasjs/dev` 后，可通过 `faas knex <action>` 执行 migration：

- 命令执行前会自动读取 `.env`：
  - 传入 `--root <path>` 时读取 `<path>/.env`
  - 未传入 `--root` 时读取 `process.cwd()/.env`

```bash
# 执行待迁移
mise exec -- npm run migrate:latest

# 回滚最近一次迁移批次
mise exec -- npm run migrate:rollback

# 查看待迁移数量
mise exec -- npm run migrate:status

# 查看当前迁移版本
mise exec -- npm run migrate:current

# 创建 migration
mise exec -- npm run migrate:make -- create_users
```

```ts
import { KnexSchema, useKnex } from '@faasjs/core'

const knex = useKnex({
  config: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
  },
})

await knex.mount()

const schema = new KnexSchema(knex)
await schema.migrateLatest()

await knex.quit()
```

- 默认 migration 目录：`./src/db/migrations`
- 默认生成扩展名：`ts`
