# 数据库操作

数据库插件没有内置在 `faasjs` 中，使用前需自行安装依赖。

- **@faasjs/knex** 基于 Knex 封装的云函数插件。
  - `client: pg`：使用 PostgreSQL（需自行安装 `pg`）。
  - `client: pglite`：使用 PGlite（需自行安装 `@electric-sql/pglite` 与 `knex-pglite`，并使用字符串 `connection`）。
    - 未配置 `connection` 时默认使用内存数据库。
    - `pool` 配置会被忽略（PGlite 单连接）。
    - 使用目录连接时会自动创建父目录。

## Migration

- `@faasjs/knex` 提供 `KnexSchema`，用于显式执行 migration。
- 推荐在测试 setup 或部署脚本中执行 migration，不建议放在请求链路自动执行。

```ts
import { KnexSchema, useKnex } from '@faasjs/knex'

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
