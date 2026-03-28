[@faasjs/core](../README.md) / staticHandler

# Function: staticHandler()

> **staticHandler**(`options`): [`Middleware`](../type-aliases/Middleware.md)

Create middleware that serves static files from a directory.

The middleware resolves the request URL relative to `options.root`, serves the matching file,
and optionally delegates missing files to `options.notFound`.

## Parameters

### options

[`StaticHandlerOptions`](../type-aliases/StaticHandlerOptions.md)

Static file serving options.

## Returns

[`Middleware`](../type-aliases/Middleware.md)

Middleware that serves files from the configured root directory.

## Example

```ts
import { staticHandler, useMiddleware } from '@faasjs/core'

export const func = useMiddleware(
  staticHandler({
    root: `${__dirname}/public`,
  }),
)
```
