[@faasjs/core](../README.md) / useMiddlewares

# Function: useMiddlewares()

> **useMiddlewares**(`handlers`): `Promise`\<[`Func`](../classes/Func.md)\<[`MiddlewareEvent`](../type-aliases/MiddlewareEvent.md), `any`, `any`\>\>

Apply an array of middleware functions to an event.

## Parameters

### handlers

[`Middleware`](../type-aliases/Middleware.md)[]

Middleware functions to run in order until one ends the response.

## Returns

`Promise`\<[`Func`](../classes/Func.md)\<[`MiddlewareEvent`](../type-aliases/MiddlewareEvent.md), `any`, `any`\>\>

Wrapper that applies each middleware to the incoming event.

## Example

```typescript
import { useMiddlewares } from '@faasjs/core'

export const func = useMiddlewares([
  (request, response) => {
    if (request.url === '/hi') return
    response.end('Hello, World!')
  },
  (request, response) => {
    if (request.url === '/hello') return
    response.end('Hi, World!')
  },
])
```
