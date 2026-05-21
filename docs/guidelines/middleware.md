# Middleware Guide

Use this guide when you need to serve static files in a FaasJS application.

## staticHandler

`staticHandler` creates a middleware that serves files from a directory. It is used with `useMiddleware` to produce an exported handler.

```ts
import { staticHandler, useMiddleware } from '@faasjs/core'

export default useMiddleware(
  staticHandler({
    root: `${__dirname}/public`,
  }),
)
```

### Options

| Option        | Type                              | Default      | Description                                     |
| ------------- | --------------------------------- | ------------ | ----------------------------------------------- |
| `root`        | `string`                          | _(required)_ | Directory root for resolving requested files    |
| `notFound`    | `boolean \| string \| Middleware` | `false`      | Fallback when a file is missing                 |
| `cache`       | `boolean \| string`               | `true`       | Cache resolved file lookups by root directory   |
| `stripPrefix` | `string \| RegExp`                | —            | URL prefix to remove before resolving file path |

#### notFound

- `false` (default) — leave the response untouched
- `true` — send a plain `404 Not Found`
- A string — serve a fallback file (e.g. `'index.html'` for SPA routing)
- A `Middleware` function — delegate the miss to custom logic

#### cache

When enabled, resolved file paths and MIME types are cached by request URL so repeated lookups skip the filesystem.

### Path traversal protection

`staticHandler` uses `isPathInsideRoot` to reject requests that escape the configured `root` directory. This prevents `../` traversal and symlink escape attacks.

### Example: Serve a public directory with SPA fallback

```ts
import { staticHandler, useMiddleware } from '@faasjs/core'

export default useMiddleware(
  staticHandler({
    root: `${__dirname}/public`,
    notFound: 'index.html',
    stripPrefix: '/static',
  }),
)
```

Files in `public/` are served under the `/static` URL prefix. Requests for missing files receive `public/index.html`, making this pattern suitable for single-page application hosting.

## Review Checklist

- `staticHandler` is used with `useMiddleware`, not as a standalone export
- `root` points to an absolute directory path
- `notFound` is configured when the app needs SPA-style fallback routing
- `stripPrefix` matches the URL prefix used in the frontend build
- Path traversal protection is active by default (no additional configuration needed)

## Further Reading

- [defineApi Guide](./define-api.md)
- [Project Config Guide](./project-config.md)
