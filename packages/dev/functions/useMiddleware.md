[@faasjs/dev](../README.md) / useMiddleware

# Function: useMiddleware()

> **useMiddleware**(`handler`): `Promise`\<[`Func`](../classes/Func.md)\<[`MiddlewareEvent`](../type-aliases/MiddlewareEvent.md), `any`, `any`\>\>

Create a function that runs one middleware and falls back to `404 Not Found`.

## Parameters

### handler

[`Middleware`](../type-aliases/Middleware.md)

Middleware to execute for each incoming request.

## Returns

`Promise`\<[`Func`](../classes/Func.md)\<[`MiddlewareEvent`](../type-aliases/MiddlewareEvent.md), `any`, `any`\>\>

Promise that resolves to a function wrapper.

## Example

```ts
import { useMiddleware } from '@faasjs/core'

export const func = useMiddleware((request, response, { logger }) => {
  response.setHeader('x-hello', 'World')
  response.end('Hello, World!')
  logger.info('Hello, World!')
})
```
