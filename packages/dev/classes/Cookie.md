[@faasjs/dev](../README.md) / Cookie

# Class: Cookie\<C, S\>

Read, write, and serialize cookies for the HTTP plugin.

## Example

```ts
import { Cookie } from '@faasjs/core'

const cookie = new Cookie({
  secure: false,
  session: { secret: 'replace-me' },
})

cookie.write('theme', 'dark')
cookie.headers()
```

## Type Parameters

### C

`C` _extends_ `Record`\<`string`, `string`\> = `any`

Cookie value map exposed by `read()` and `content`.

### S

`S` _extends_ `Record`\<`string`, `string`\> = `any`

Session value map exposed by the nested session helper.

## Constructors

### Constructor

> **new Cookie**\<`C`, `S`\>(`config`, `logger?`, `options?`): `Cookie`\<`C`, `S`\>

Create a cookie manager.

#### Parameters

##### config

[`CookieOptions`](../type-aliases/CookieOptions.md)

Cookie defaults including session settings.

##### logger?

`Logger`

Optional logger used by cookie and session helpers.

##### options?

Internal template reuse options.

###### template?

`Cookie`\<`C`, `S`\>

Existing cookie template reused by `fork()`.

#### Returns

`Cookie`\<`C`, `S`\>

## Methods

### fork()

> **fork**(`logger?`): `Cookie`\<`C`, `S`\>

Clone the cookie manager while reusing normalized config and secrets.

#### Parameters

##### logger?

`Logger`

Optional logger for the forked instance.

#### Returns

`Cookie`\<`C`, `S`\>

Forked cookie manager for a single invocation.

---

### headers()

> **headers**(): `object`

Build `Set-Cookie` headers for queued writes.

#### Returns

`object`

Header bag suitable for merging into an HTTP response.

##### Set-Cookie?

> `optional` **Set-Cookie?**: `string`[]

---

### invoke()

> **invoke**(`cookie`, `logger`): `Cookie`\<`C`, `S`\>

Load request cookies and bootstrap the related session state.

#### Parameters

##### cookie

`string` \| `undefined`

Raw `Cookie` header value.

##### logger

`Logger`

Logger forwarded to the session helper.

#### Returns

`Cookie`\<`C`, `S`\>

Current cookie manager for chaining.

---

### read()

> **read**(`key`): `any`

Read a cookie value by key.

#### Parameters

##### key

`string`

Cookie name.

#### Returns

`any`

Decoded cookie value for the current request.

---

### write()

> **write**(`key`, `value`, `opts?`): `Cookie`\<`C`, `S`\>

Queue a cookie write or removal for the outgoing response.

#### Parameters

##### key

`string`

Cookie name.

##### value

`string` \| `null` \| `undefined`

Cookie value, or `null`/`undefined` to expire it.

##### opts?

Per-cookie attribute overrides.

###### domain?

`string`

Cookie domain attribute override.

###### expires?

`string` \| `number`

`max-age` seconds or absolute `expires` string override.

###### httpOnly?

`boolean`

Whether the written cookie is hidden from client-side scripts.

###### path?

`string`

Cookie path attribute override.

###### sameSite?

`"Strict"` \| `"Lax"` \| `"None"`

SameSite attribute override.

###### secure?

`boolean`

Whether the written cookie requires HTTPS transport.

#### Returns

`Cookie`\<`C`, `S`\>

Current cookie manager for chaining.

## Properties

### config

> `readonly` **config**: `CookieConfig`

Normalized cookie configuration with defaults applied.

---

### content

> **content**: `Record`\<`string`, `string`\>

Parsed cookie key-value pairs for the current request.

---

### logger

> **logger**: `Logger` \| `undefined`

Optional logger used for warnings and debug output.

---

### session

> **session**: [`Session`](Session.md)\<`S`, `C`\>

Session helper bound to this cookie store.
