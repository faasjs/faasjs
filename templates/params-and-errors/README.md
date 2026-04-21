# Params And Errors

Validate JSON input with Zod and handle API errors in a predictable way.

使用 Zod 校验参数，并演示可预测的接口错误处理。

## What you learn / 你将学到

- Schema-first API input validation.
- Why the endpoint lives in `create.api.ts` and uses a default-exported API module.
- Difference between `HttpError` (custom status) and generic `Error` (500).
- How to write tests for success and failure paths.

- 基于 schema 的参数校验方式。
- 为什么接口入口使用 `create.api.ts` 并采用默认导出的 API 模块。
- `HttpError`（可自定义状态码）与普通 `Error`（500）的区别。
- 如何覆盖成功与失败分支测试。

## Run / 运行

```bash
vp install
vp test
vp run dev
```

Try request:

```bash
curl -X POST http://127.0.0.1:3000/orders/api/create \
  -H 'content-type: application/json' \
  -d '{"title":"Book","price":18,"quantity":2}'
```
