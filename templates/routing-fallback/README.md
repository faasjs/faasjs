# Routing Fallback

Understand how FaasJS resolves `index.api.ts` and `default.api.ts`.

理解 FaasJS 如何命中 `index.api.ts` 与 `default.api.ts`。

## What you learn / 你将学到

- File-system routing with zero mapping.
- Why `index.api.ts` and `default.api.ts` use default-exported API modules.
- Fallback order from exact file to parent `default.api.ts`.
- How to verify routes through integration tests.

- 基于文件系统的零映射路由。
- 为什么 `index.api.ts` 和 `default.api.ts` 使用默认导出的 API 模块。
- 从精确文件到上级 `default.api.ts` 的回退顺序。
- 如何通过集成测试验证路由行为。

## Run / 运行

```bash
vp install
vp test
vp run dev
```

Try requests:

```bash
curl -X POST http://127.0.0.1:3000/blog/api -H 'content-type: application/json' -d '{}'
curl -X POST http://127.0.0.1:3000/blog/api/unknown -H 'content-type: application/json' -d '{}'
curl -X POST http://127.0.0.1:3000/blog/api/post/not-found -H 'content-type: application/json' -d '{}'
```
