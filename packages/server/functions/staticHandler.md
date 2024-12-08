[@faasjs/server](../README.md) / staticHandler

# Function: staticHandler()

> **staticHandler**(`options`): [`Middleware`](../type-aliases/Middleware.md)

Middleware to handle static file requests.

## Parameters

### options

[`StaticHandlerOptions`](../type-aliases/StaticHandlerOptions.md)

Options for the static handler.

## Returns

[`Middleware`](../type-aliases/Middleware.md)

The middleware function.

The middleware resolves the requested URL to a file path within the specified root directory.
If the file exists, it reads the file content and sends it in the response.
If the file does not exist, it does nothing.

## Example

```typescript
import { useMiddleware, staticHandler } from '@faasjs/server'

export default useMiddleware(staticHandler({ root: __dirname + '/public' }))
```
