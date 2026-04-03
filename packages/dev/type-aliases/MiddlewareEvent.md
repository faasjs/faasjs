[@faasjs/dev](../README.md) / MiddlewareEvent

# Type Alias: MiddlewareEvent

> **MiddlewareEvent** = `object`

Event shape passed to middleware-backed functions.

## Properties

### body

> **body**: `any`

Request body collected by the server.

### raw

> **raw**: `object`

Native request and response objects.

#### request

> **request**: `IncomingMessage`

#### response

> **response**: `ServerResponse`
