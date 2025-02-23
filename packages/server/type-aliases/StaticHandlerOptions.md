[@faasjs/server](../README.md) / StaticHandlerOptions

# Type Alias: StaticHandlerOptions

> **StaticHandlerOptions**: `object`

## Type declaration

### cache?

> `optional` **cache**: `boolean` \| `string`

Cache static files.
If set to `true`, the middleware will cache static files.
If set to a string, the middleware will cache static files with the specified key.
If set to `false`, the middleware will not cache static files.

#### Default

```ts
true
```

### notFound?

> `optional` **notFound**: [`Middleware`](Middleware.md) \| `boolean`

Not found handler.

If set to `true`, the middleware will respond with a default 404 status code.
If set to a function, the middleware will call the function with the request, response, and logger.
If set to `false`, the middleware will do nothing.

#### Default

```ts
false
```

### root

> **root**: `string`

### stripPrefix?

> `optional` **stripPrefix**: `string` \| `RegExp`

Strip prefix from the URL.

#### Example

```typescript
import { useMiddleware, staticHandler } from '@faasjs/server'

export const func = useMiddleware(staticHandler({ root: __dirname + '/public', stripPrefix: '/public' })) // /public/index.html -> /index.html
```
