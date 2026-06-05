# Routing Fallback

Understand how FaasJS resolves `index.api.ts` and `default.api.ts`.

## What You Learn

- File-system routing with zero mapping.
- Why `index.api.ts` and `default.api.ts` use default-exported API modules.
- Fallback order from exact file to parent `default.api.ts`.
- How to verify routes through integration tests.

## Run

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
