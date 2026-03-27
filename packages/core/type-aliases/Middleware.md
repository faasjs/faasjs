[@faasjs/core](../README.md) / Middleware

# Type Alias: Middleware

> **Middleware** = (`request`, `response`, `context`) => `void` \| `Promise`\<`void`\>

Request middleware signature used by [useMiddleware](../functions/useMiddleware.md) and [useMiddlewares](../functions/useMiddlewares.md).

## Parameters

### request

`IncomingMessage` & `object`

### response

`ServerResponse`

### context

[`MiddlewareContext`](MiddlewareContext.md)

## Returns

`void` \| `Promise`\<`void`\>
