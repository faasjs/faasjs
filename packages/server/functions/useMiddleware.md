[@faasjs/server](../README.md) / useMiddleware

# Function: useMiddleware()

> **useMiddleware**(`handler`): `Promise`\<`Func`\<[`MiddlewareEvent`](../type-aliases/MiddlewareEvent.md), `any`, `any`\>\>

Apply a middleware function to handle incoming requests.

## Parameters

### handler

[`Middleware`](../type-aliases/Middleware.md)

The middleware function to handle the request and response.

## Returns

`Promise`\<`Func`\<[`MiddlewareEvent`](../type-aliases/MiddlewareEvent.md), `any`, `any`\>\>

A function that processes the event and applies the middleware.

## Example

```typescript
import { useMiddleware } from '@faasjs/server'

export const func = useMiddleware((request, response, logger) => {
  response.setHeader('X-Hello', 'World')
  response.end('Hello, World!')
  logger.info('Hello, World!')
})
```
