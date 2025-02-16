[@faasjs/server](../README.md) / useMiddlewares

# Function: useMiddlewares()

> **useMiddlewares**(`handlers`): `Promise`\<`Func`\<[`MiddlewareEvent`](../type-aliases/MiddlewareEvent.md), `any`, `any`\>\>

Apply an array of middleware functions to an event.

## Parameters

### handlers

[`Middleware`](../type-aliases/Middleware.md)[]

An array of middleware functions to be applied.

## Returns

`Promise`\<`Func`\<[`MiddlewareEvent`](../type-aliases/MiddlewareEvent.md), `any`, `any`\>\>

A promise that resolves when all middleware functions have been applied.

## Example

```typescript
import { useMiddlewares } from '@faasjs/server'

export default useMiddlewares([
  (request, response) => {
    if (request.url === '/hi') return
    response.end('Hello, World!')
  },
  (request, response) => {
    if (request.url === '/hello') return
    response.end('Hi, World!')
  }
])
```
