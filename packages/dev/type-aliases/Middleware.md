[@faasjs/dev](../README.md) / Middleware

# Type Alias: Middleware

> **Middleware** = (`request`, `response`, `context`) => `void` \| `Promise`\<`void`\>

Request middleware signature used by [useMiddleware](../functions/useMiddleware.md) and [useMiddlewares](../functions/useMiddlewares.md).

## Parameters

### request

`IncomingMessage` & `object`

Native request object extended with the parsed body on `request.body`.

### response

`ServerResponse`

Native response writer.

### context

[`MiddlewareContext`](MiddlewareContext.md)

Middleware-scoped utilities.

## Returns

`void` \| `Promise`\<`void`\>

Promise or void returned by the middleware.
