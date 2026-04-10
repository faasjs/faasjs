[@faasjs/dev](../README.md) / useMiddlewares

# Function: useMiddlewares()

> **useMiddlewares**(`handlers`): `Promise`\<[`Func`](../classes/Func.md)\<[`MiddlewareEvent`](../type-aliases/MiddlewareEvent.md), `Pick`\<[`MiddlewareContext`](../type-aliases/MiddlewareContext.md), `"root"`\>, `any`\>\>

Create a function that runs middleware handlers in sequence until one ends the response.

## Parameters

### handlers

[`Middleware`](../type-aliases/Middleware.md)[]

Middleware functions to run in order.

## Returns

`Promise`\<[`Func`](../classes/Func.md)\<[`MiddlewareEvent`](../type-aliases/MiddlewareEvent.md), `Pick`\<[`MiddlewareContext`](../type-aliases/MiddlewareContext.md), `"root"`\>, `any`\>\>

Promise that resolves to a function wrapper.

## Example

```ts
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
