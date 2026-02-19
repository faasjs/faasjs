# Shared Testing Kit

When the same mock/setup appears in 2+ test files, extract it into shared helpers.

## Recommended layout

```txt
src/pages/home/api/__tests__/
  hello.test.ts
  create-user.test.ts
  shared/
    mocks.ts
    lifecycle.ts
    call.ts
```

## shared/mocks.ts

Use one source of truth for module mocks and reset logic.

```ts
import { vi } from 'vitest'

export const sharedMocks = vi.hoisted(() => ({
  query: vi.fn(),
  transaction: vi.fn(),
  now: vi.fn(() => '2026-02-17T00:00:00.000Z'),
}))

vi.mock('@faasjs/knex', () => ({
  query: sharedMocks.query,
  transaction: sharedMocks.transaction,
}))

export function resetSharedMocks(): void {
  sharedMocks.query.mockReset()
  sharedMocks.transaction.mockReset()
  sharedMocks.now.mockReset()
}
```

## shared/lifecycle.ts

Provide one reusable lifecycle hook to keep cleanup consistent.

```ts
import { afterEach, beforeEach, vi } from 'vitest'
import { resetSharedMocks } from './mocks'

export function useSharedLifecycle(): void {
  beforeEach(() => {
    vi.clearAllMocks()
    resetSharedMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })
}
```

## shared/call.ts

Wrap repeated `test(func).JSONhandler(...)` options to reduce boilerplate.

```ts
import { test } from '@faasjs/dev'
import type { Func } from '@faasjs/func'

type JsonCallOptions = {
  headers?: Record<string, string>
  cookie?: Record<string, any>
  session?: Record<string, any>
}

export function createJsonCaller(func: Func) {
  const call = test(func)

  return async function invoke(
    body?: Record<string, unknown> | string | null,
    options: JsonCallOptions = {},
  ) {
    return await call.JSONhandler(body, {
      headers: {
        'x-request-id': 'unit-test',
        ...options.headers,
      },
      cookie: options.cookie,
      session: options.session,
    })
  }
}
```

## Adoption rule

- Start local for a single file.
- Promote to `shared/` once repeated in multiple files.
- Keep shared helpers minimal and deterministic.
