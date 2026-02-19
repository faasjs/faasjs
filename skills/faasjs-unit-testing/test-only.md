# Test-only Workflow

Use `test()` from `@faasjs/dev` as the first choice for FaasJS unit tests.

## Why test()

- It is the stable public helper exposed for testing in `@faasjs/dev`.
- It already provides `handler()` and `JSONhandler()` wrappers.
- It keeps tests concise and avoids repeated wrapper binding code.

## Basic pattern

```ts
import { test } from '@faasjs/dev'
import { func } from '../hello.func'

describe('home/api/hello', () => {
  it('returns hello message', async () => {
    const { statusCode, data } = await test(func).JSONhandler({ name: 'world' })

    expect(statusCode).toEqual(200)
    expect(data).toEqual({
      message: 'Hello, world',
    })
  })
})
```

## Assertion rules

- HTTP-style functions: assert `statusCode` + `data`/`error` + key headers when needed.
- Pure function logic: use `await test(func).handler(...)` and assert domain output.
- Error paths: assert specific message/code to avoid brittle snapshots.

## Anti-patterns

- Do not assert full response objects when only one field matters.
- Do not couple test order; keep each case independently runnable.
