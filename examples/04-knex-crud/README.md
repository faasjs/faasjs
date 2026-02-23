# 04 Knex CRUD

Build a small Todo API with migration, CRUD, and transaction.

通过 Todo API 实战 migration、CRUD 与事务。

## What you learn / 你将学到

- How to configure the built-in Knex plugin in `faas.yaml`.
- How to write and run migrations with `faas knex` CLI.
- How to use query-builder and transaction in handlers.

- 如何在 `faas.yaml` 配置内置 Knex 插件。
- 如何通过 `faas knex` 命令执行 migration。
- 如何在 handler 中使用查询构造器与事务。

## Run / 运行

```bash
npm install
npm run test
npm run migrate:latest
npm run dev
```

Try requests:

```bash
curl -X POST http://127.0.0.1:3000/todos/api/create -H 'content-type: application/json' -d '{"title":"first"}'
curl -X POST http://127.0.0.1:3000/todos/api/list -H 'content-type: application/json' -d '{}'
```
