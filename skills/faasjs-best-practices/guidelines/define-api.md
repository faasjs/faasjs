# defineApi Guide

When implementing or reviewing a FaasJS HTTP endpoint, default to `defineApi`.

## Use This Guide When

- creating a new `.func.ts` API
- reviewing request validation, error handling, return shape, or injected HTTP helpers
- updating a route that should stay compatible with generated Faas action types

## Default Workflow

1. Export `const func = defineApi(...)`.
2. Write the `schema` inline in `defineApi` unless it is reused elsewhere.
3. Keep business logic in `handler({ params })`.
4. Return business data directly unless protocol-level response control is required.
5. After creating, renaming, or moving an API file, run `faas types` to update `src/.faasjs/types.d.ts`.
6. Add a focused test with `test(func).JSONhandler(...)`.

## Minimal Example

```ts
import { defineApi, z } from '@faasjs/core'

export const func = defineApi({
  schema: z.object({
    name: z.string().min(1).optional(),
  }),
  async handler({ params }) {
    return {
      message: `Hello, ${params.name || 'FaasJS'}!`,
    }
  },
})
```

## Rules

### 1. Use inline schema by default

- Prefer defining `schema` directly inside `defineApi`.
- Extract schema into a separate constant only when it is reused, shared across files, or meaningfully improves readability.
- Treat `schema` as the source of truth for external input.

Prefer this:

```ts
export const func = defineApi({
  schema: z.object({
    id: z.coerce.number().int().positive(),
  }),
  async handler({ params }) {
    return params.id
  },
})
```

Instead of extracting `schema` early without a reuse reason.

### 2. Use `params` for business input

- `defineApi` validates parsed request params and passes the typed result to `handler`.
- `params` is the parsed, validated view of `event.params`.
- `event` keeps the raw request payload; reach for it only when you need transport-level details or unparsed input.
- Prefer `params` over raw request fields for business logic.
- Read `event`, `headers`, or `body` only when transport-level behavior matters.

### 3. Throw `Error` by default

- Prefer `throw Error(message)` for normal business or user-facing failures.
- A plain `Error` keeps its message in the JSON error body and responds with HTTP `500`.
- Use `HttpError` only when you need to control `statusCode` or other HTTP-specific behavior.
- If the client contract depends on a specific non-`500` status, use `HttpError` explicitly.
- Let Zod validation handle request-shape errors whenever possible.

Response behavior summary:

- `throw Error('message')` -> JSON error response with message and status `500`
- `throw new HttpError({ statusCode: 409, message: 'message' })` -> JSON error response with message and status `409`

Example:

```ts
import { defineApi, HttpError, z } from '@faasjs/core'

export const func = defineApi({
  schema: z.object({
    title: z.string().min(1),
    price: z.number().positive(),
    quantity: z.number().int().positive().default(1),
  }),
  async handler({ params }) {
    if (params.title === 'duplicate') {
      throw Error('Order title already exists')
    }

    if (params.title === 'conflict') {
      throw new HttpError({
        statusCode: 409,
        message: 'Order title conflicts with an existing resource',
      })
    }

    if (params.title === 'explode') throw Error('Unexpected failure')

    return {
      id: 'demo-order',
      title: params.title,
      total: params.price * params.quantity,
    }
  },
})
```

### 4. Return business data directly by default

- Returning a plain value or object is the normal path.
- The HTTP layer will serialize it as a JSON response.
- Use `setHeader`, `setStatusCode`, `setContentType`, or `setBody` only when protocol-level control is actually needed.
- If a handler returns nothing and does not set a body, the response may become `204`.

### 5. Remember the injected HTTP helpers

`defineApi` handlers always receive:

- `params`
- `event`

With the HTTP plugin, handlers can also receive HTTP-related fields including:

- `cookie`
- `session`
- `headers`
- `body`
- `setHeader`
- `setContentType`
- `setStatusCode`
- `setBody`

Use them only when the endpoint truly needs them.

### 6. Support plugin-injected fields with types

If a plugin injects extra fields such as `current_user`, extend `DefineApiInject` so the handler stays type-safe.

```ts
declare module '@faasjs/core' {
  interface DefineApiInject {
    current_user?: {
      id: number
      name: string
    } | null
  }
}
```

### 7. Run type generation after changing APIs

After creating, renaming, or moving a `.func.ts` file, run:

```bash
faas types
```

Run this from your FaasJS app root, using the app's configured FaasJS CLI.

This updates:

```text
src/.faasjs/types.d.ts
```

Do this before handing off the change, so route-to-type mappings stay in sync.

## Testing Checklist

Use `@faasjs/dev` and cover:

- success path
- invalid params -> `400`
- plain `Error` -> `500` with the expected message
- special HTTP error behavior via `HttpError` when used
- unexpected error -> `500`
- cookie/session behavior when used

Example:

```ts
import { test } from '@faasjs/dev'
import { describe, expect, it } from 'vite-plus/test'

import { func } from '../create.func'

describe('orders/api/create', () => {
  const wrapped = test(func)

  it('returns 400 when params are invalid', async () => {
    const response = await wrapped.JSONhandler({
      title: '',
      price: -1,
      quantity: 1,
    })

    expect(response.statusCode).toBe(400)
    expect(response.error?.message).toContain('Invalid params')
  })

  it('returns 500 for plain Error', async () => {
    const response = await wrapped.JSONhandler({
      title: 'duplicate',
      price: 10,
      quantity: 1,
    })

    expect(response.statusCode).toBe(500)
    expect(response.error?.message).toBe('Order title already exists')
  })

  it('returns custom status for HttpError', async () => {
    const response = await wrapped.JSONhandler({
      title: 'conflict',
      price: 10,
      quantity: 1,
    })

    expect(response.statusCode).toBe(409)
    expect(response.error?.message).toBe('Order title conflicts with an existing resource')
  })
})
```

## Read Next

- [defineApi API reference](../references/packages/core/functions/defineApi.md)
- [DefineApiData](../references/packages/core/type-aliases/DefineApiData.md)
- [DefineApiOptions](../references/packages/core/type-aliases/DefineApiOptions.md)
- [HttpError](../references/packages/core/classes/HttpError.md)
- [test](../references/packages/dev/functions/test.md)
- [FuncWarper](../references/packages/dev/classes/FuncWarper.md)
- [generateFaasTypes](../references/packages/dev/functions/generateFaasTypes.md)
