# defineApi Guide

When implementing or reviewing a FaasJS HTTP endpoint, default to `defineApi`.

## Default Workflow

1. Export `default defineApi(...)`.
2. Write the `schema` inline in `defineApi` unless it is reused elsewhere.
3. Keep business logic direct inside `handler({ params })` unless a shared boundary already exists.
4. Return business data directly unless protocol-level response control is required.
5. After creating, renaming, or moving an API file, run `faas types` to update `src/.faasjs/types.d.ts`.
6. Add a focused test with `testApi(api)(data, options?)`.

## Minimal Example

```ts
import { defineApi } from '@faasjs/core'
import * as z from 'zod'

export default defineApi({
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
export default defineApi({
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
- Let `schema` cover request-shape validation at the boundary, then fail fast inside `handler` when domain state is invalid instead of layering extra fallback branches.

### 3. Choose error status deliberately

- Let Zod validation handle request-shape errors whenever possible.
- Use `HttpError` when the failure is an expected client or business outcome and callers should see a non-`500` status.
- Prefer common explicit statuses for expected failures: `400` for invalid business input not covered by schema, `401` for unauthenticated requests, `403` for permission failures, `404` for missing scoped resources, and `409` for conflicts.
- Use plain `throw Error(message)` for unexpected internal failures or invariant breaks. A plain `Error` keeps its message in the JSON error body and responds with HTTP `500`.
- Do not hide permission, tenant, or resource-scope failures behind broad fallback responses.

Response behavior summary:

- Zod schema failure -> validation error response from the framework
- `throw new HttpError({ statusCode: 409, message: 'message' })` -> JSON error response with message and status `409`
- `throw Error('message')` -> JSON error response with message and status `500`

Example:

```ts
import { defineApi, HttpError } from '@faasjs/core'
import * as z from 'zod'

export default defineApi({
  schema: z.object({
    title: z.string().min(1),
    price: z.number().positive(),
    quantity: z.number().int().positive().default(1),
  }),
  async handler({ params }) {
    if (params.title === 'duplicate') {
      throw new HttpError({
        statusCode: 409,
        message: 'Order title already exists',
      })
    }

    if (params.title === 'forbidden') {
      throw new HttpError({
        statusCode: 403,
        message: 'You cannot create this order',
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

After creating, renaming, or moving a `.api.ts` file, run:

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

Follow the shared [Testing Guide](./testing.md) first, then use `@faasjs/dev` and cover:

- success path
- invalid params -> `400`
- expected business, auth, permission, missing-resource, or conflict errors via `HttpError` when used
- unexpected or invariant errors via plain `Error` -> `500` with the expected message
- cookie/session behavior when used

Example:

```ts
import { testApi } from '@faasjs/dev'
import { describe, expect, it } from 'vite-plus/test'

import api from '../create.api'

describe('orders/api/create', () => {
  const handler = testApi(api)

  it('returns 400 when params are invalid', async () => {
    const response = await handler({
      title: '',
      price: -1,
      quantity: 1,
    })

    expect(response.statusCode).toBe(400)
    expect(response.error?.message).toContain('Invalid params')
  })

  it('returns 409 for expected conflicts', async () => {
    const response = await handler({
      title: 'duplicate',
      price: 10,
      quantity: 1,
    })

    expect(response.statusCode).toBe(409)
    expect(response.error?.message).toBe('Order title already exists')
  })

  it('returns 500 for unexpected internal failures', async () => {
    const response = await handler({
      title: 'explode',
      price: 10,
      quantity: 1,
    })

    expect(response.statusCode).toBe(500)
    expect(response.error?.message).toBe('Unexpected failure')
  })
})
```
