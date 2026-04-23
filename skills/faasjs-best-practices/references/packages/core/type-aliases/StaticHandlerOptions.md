[@faasjs/core](../README.md) / StaticHandlerOptions

# Type Alias: StaticHandlerOptions

> **StaticHandlerOptions** = `object`

Options for [staticHandler](../functions/staticHandler.md).

## Properties

### cache?

> `optional` **cache?**: `boolean` \| `string`

Cache control for resolved static files.

Set `true` to cache by root directory, a string to use a custom cache namespace,
or `false` to disable lookup caching.

#### Default

```ts
true
```

### notFound?

> `optional` **notFound?**: [`Middleware`](Middleware.md) \| `boolean` \| `string`

Fallback behavior used when a file is missing.

Set `true` to send a default `404 Not Found` response, a string to serve a fallback file,
a middleware function to handle the miss manually, or `false` to leave the response untouched.

#### Default

```ts
false
```

### root

> **root**: `string`

Root directory used to resolve requested files.

### stripPrefix?

> `optional` **stripPrefix?**: `string` \| `RegExp`

URL prefix removed before resolving the file path.

#### Example

```ts
import { useMiddleware, staticHandler } from '@faasjs/core'

export default useMiddleware(
  staticHandler({
    root: `${__dirname}/public`,
    stripPrefix: '/public',
  }),
)
```
