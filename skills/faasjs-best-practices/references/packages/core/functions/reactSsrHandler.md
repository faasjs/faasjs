[@faasjs/core](../README.md) / reactSsrHandler

# Function: reactSsrHandler()

> **reactSsrHandler**(`options`): [`Middleware`](../type-aliases/Middleware.md)

Create middleware that serves built assets first and falls back to React SSR HTML.

The middleware serves matched static files from `options.root`, loads a built
React SSR renderer when needed, and injects serialized page props into the HTML
template.

## Parameters

### options

[`ReactSsrHandlerOptions`](../type-aliases/ReactSsrHandlerOptions.md)

React SSR handler options.

## Returns

[`Middleware`](../type-aliases/Middleware.md)

Middleware that serves static assets and React SSR HTML.

## Example

```ts
import { reactSsrHandler } from '@faasjs/core'
import { join } from 'node:path'

const distRoot = join(process.cwd(), 'dist')
const distReactSsrRoot = join(process.cwd(), 'dist-server')

const handler = reactSsrHandler({
  root: distRoot,
  serverRoot: distReactSsrRoot,
})
```
