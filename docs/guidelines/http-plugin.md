# HTTP Plugin Guide

Use this guide when working with cookies, sessions, response helpers, or HTTP plugin configuration in FaasJS APIs.

## Overview

The HTTP plugin is built into `@faasjs/core` and **activated automatically** for every `defineApi` endpoint. You do not need to declare it in `faas.yaml`.

It only processes invocations when `data.context.runtime` is missing or set to `api`. When the same plugin is inherited by a background job, `context.runtime === 'job'` makes the HTTP plugin call `await next()` without parsing HTTP params, injecting HTTP helpers, or rewriting job params.

It injects the following fields into every `defineApi` handler:

- `cookie` — read and write cookies
- `session` — encrypted session storage backed by a signed cookie
- `headers` — raw request headers
- `body` — raw request body
- `setHeader` — set a response header
- `setContentType` — set the response Content-Type
- `setStatusCode` — set the HTTP status code
- `setBody` — set the response body

## Cookie

### Reading cookies

```ts
import { defineApi } from '@faasjs/core'

export default defineApi({
  async handler({ cookie }) {
    const theme = cookie.read('theme')
    return { theme }
  },
})
```

### Writing cookies

```ts
cookie.write('theme', 'dark')
```

Set `null` or `undefined` to expire a cookie:

```ts
cookie.write('theme', null)
```

Per-cookie attribute overrides:

```ts
cookie.write('token', 'abc', {
  domain: '.example.com',
  path: '/',
  expires: 86400, // max-age seconds
  secure: true,
  httpOnly: true,
  sameSite: 'Lax',
})
```

### Default cookie attributes

| Attribute  | Default    |
| ---------- | ---------- |
| `path`     | `/`        |
| `expires`  | `31536000` |
| `secure`   | `true`     |
| `httpOnly` | `true`     |

Override these globally in `faas.yaml` (see [Configuration](#configuration)).

## Session

Session data is encrypted (AES-256-CBC) and signed (HMAC-SHA256), then stored in a cookie.

### Reading session values

```ts
const userId = cookie.session.read('userId')
```

### Writing session values

```ts
cookie.session.write('userId', 'u_123')
```

Set `null` or `undefined` to remove a key:

```ts
cookie.session.write('userId', null)
```

### Persisting changes

Session writes are held in memory. The HTTP plugin calls `session.update()` automatically after each request, so you normally do not need to call it. Call it explicitly only when you need the cookie header before the response is built:

```ts
cookie.session.write('locale', 'zh-CN')
cookie.session.update()
```

### Typical login/logout pattern

```ts
import { defineApi, HttpError } from '@faasjs/core'

export default defineApi({
  async handler({ cookie, params }) {
    // Login
    const user = await authenticate(params)
    cookie.session.write('userId', user.id)
    return { ok: true }
  },
})

export default defineApi({
  async handler({ cookie }) {
    // Logout
    cookie.session.write('userId', null)
    return { ok: true }
  },
})
```

### Reading current user in other APIs

```ts
import { defineApi, HttpError } from '@faasjs/core'

export default defineApi({
  async handler({ cookie }) {
    const userId = cookie.session.read('userId')
    if (!userId) throw new HttpError({ statusCode: 401, message: 'Not authenticated' })
    return { userId }
  },
})
```

## Response helpers

### setHeader

```ts
setHeader('X-Custom', 'value')
```

Header names are lowercased automatically.

### setContentType

Accepts a `ContentType` key or a raw MIME type:

```ts
setContentType('json')
setContentType('text/html', 'utf-8')
setContentType('application/pdf')
```

### setStatusCode

```ts
setStatusCode(201)
```

### setBody

```ts
setBody({ custom: 'payload' })
setBody('raw string')
```

## ContentType enum

Use with `setContentType` for common MIME types:

| Key          | Value                    |
| ------------ | ------------------------ |
| `plain`      | `text/plain`             |
| `html`       | `text/html`              |
| `xml`        | `application/xml`        |
| `csv`        | `text/csv`               |
| `css`        | `text/css`               |
| `javascript` | `application/javascript` |
| `json`       | `application/json`       |
| `jsonp`      | `application/javascript` |

## Configuration

Configure cookie and session defaults in `src/faas.yaml` under `defaults.plugins.http.config.cookie`:

```yaml
defaults:
  plugins:
    http:
      config:
        cookie:
          secure: false
          domain: '.example.com'
          sameSite: 'Lax'
          session:
            key: 'session_id'
            secret: ${SESSION_SECRET}
            salt: 'salt'
            iterations: 100
```

### Session configuration

| Option       | Default         | Description                                       |
| ------------ | --------------- | ------------------------------------------------- |
| `key`        | `'key'`         | Cookie name for the session payload               |
| `secret`     | _(required)_    | Secret used to derive encryption and signing keys |
| `salt`       | `'salt'`        | Salt for encryption key derivation                |
| `signedSalt` | `'signedSalt'`  | Salt for signing key derivation                   |
| `keylen`     | `64`            | Derived key length in bytes                       |
| `iterations` | `100`           | PBKDF2 iteration count                            |
| `digest`     | `'sha256'`      | Hash algorithm                                    |
| `cipherName` | `'aes-256-cbc'` | Encryption cipher                                 |

### Environment variable injection

Configuration values can also come from environment variables using the pattern `SECRET_<NAME>_<KEY_PATH>`:

```bash
SECRET_HTTP_COOKIE_SESSION_SECRET=my-secret
SECRET_HTTP_COOKIE_SESSION_SALT=custom-salt
```

This is resolved at plugin mount time and merged into the config object.

## Security

- Always set `cookie.session.secret` in production. Use an environment variable reference (`${SECRET}`) rather than a literal in `faas.yaml`.
- Keep `cookie.secure: true` in production so cookies are only sent over HTTPS.
- Session data is encrypted and signed, but keep payloads small and avoid storing secrets that never need to leave the server.
- Do not log cookie or session content in production.

## See Also

- [HTTP Protocol Specification](./http-protocol.md) — normative specification for request/response transport behavior
- [defineApi Guide](./define-api.md) — building API endpoints that receive these injected fields

## Review Checklist

- Cookie and session operations happen inside the handler, not in module scope
- Session writes are followed by `session.update()` only when the cookie header is needed before the response (otherwise automatic)
- Login sets `session.write`, logout sets `session.write` with `null`
- `cookie.session.secret` is configured in production via environment variable
- `cookie.secure` is `true` in production, `false` in development
- Sensitive data is not stored in cookies or sessions unnecessarily
