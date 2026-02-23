# 02 Routing Fallback

Understand how FaasJS resolves `index.func.ts` and `default.func.ts`.

理解 FaasJS 如何命中 `index.func.ts` 与 `default.func.ts`。

## What you learn / 你将学到

- File-system routing with zero mapping.
- Fallback order from exact file to parent `default.func.ts`.
- How to verify routes through integration tests.

- 基于文件系统的零映射路由。
- 从精确文件到上级 `default.func.ts` 的回退顺序。
- 如何通过集成测试验证路由行为。

## Run / 运行

```bash
npm install
npm run test
npm run dev
```

Try requests:

```bash
curl -X POST http://127.0.0.1:3000/blog/api -H 'content-type: application/json' -d '{}'
curl -X POST http://127.0.0.1:3000/blog/api/unknown -H 'content-type: application/json' -d '{}'
curl -X POST http://127.0.0.1:3000/blog/api/post/not-found -H 'content-type: application/json' -d '{}'
```
