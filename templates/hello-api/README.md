# Hello API

Minimal FaasJS API example with one endpoint and one unit test.

最小可运行的 FaasJS 示例：1 个接口 + 1 组单元测试。

## What you learn / 你将学到

- How to write a `defineApi` function.
- Why FaasJS API files live in `hello.api.ts` and prefer default exports.
- How to validate request body with Zod.
- How to test an API function with `@faasjs/dev`.

- 如何使用 `defineApi` 编写接口。
- 为什么 FaasJS 接口文件使用 `hello.api.ts` 并优先采用默认导出。
- 如何通过 Zod 校验请求参数。
- 如何用 `@faasjs/dev` 编写接口单测。

## Run / 运行

```bash
vp install
vp test
vp run dev
```

Then call:

```bash
curl -X POST http://127.0.0.1:3000/hello/api/hello \
  -H 'content-type: application/json' \
  -d '{"name":"FaasJS"}'
```
