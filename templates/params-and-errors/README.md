# Params And Errors

Validate JSON input with Zod and handle API errors in a predictable way.

## What You Learn

- Schema-first API input validation.
- Why the endpoint lives in `create.api.ts` and uses a default-exported API module.
- Difference between `HttpError` (custom status) and generic `Error` (500).
- How to write tests for success and failure paths.

## Run

```bash
npm install
npm run test
npm run dev
```

Try request:

```bash
curl -X POST http://127.0.0.1:3000/orders/api/create \
  -H 'content-type: application/json' \
  -d '{"title":"Book","price":18,"quantity":2}'
```
