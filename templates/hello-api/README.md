# Hello API

Minimal FaasJS API example with one endpoint and one unit test.

## What You Learn

- How to write a `defineApi` function.
- Why FaasJS API files live in `hello.api.ts` and prefer default exports.
- How to validate request body with Zod.
- How to test an API function with `@faasjs/dev`.

## Run

```bash
npm install
npm run test
npm run dev
```

Then call:

```bash
curl -X POST http://127.0.0.1:3000/hello/api/hello \
  -H 'content-type: application/json' \
  -d '{"name":"FaasJS"}'
```
