[@faasjs/dev](../README.md) / HttpConfig

# Type Alias: HttpConfig

> **HttpConfig** = `object`

Configuration for the [Http](../classes/Http.md) plugin.

## Indexable

> \[`key`: `string`\]: `any`

## Properties

### config?

> `optional` **config?**: `object`

Runtime HTTP behavior overrides.

#### Index Signature

\[`key`: `string`\]: `any`

#### cookie?

> `optional` **cookie?**: [`CookieOptions`](CookieOptions.md)

Cookie and session configuration injected into invoke data.

#### functionName?

> `optional` **functionName?**: `string`

Explicit function name used by HTTP integrations.

#### ignorePathPrefix?

> `optional` **ignorePathPrefix?**: `string`

Path prefix removed before route matching.

#### method?

> `optional` **method?**: `"BEGIN"` \| `"GET"` \| `"POST"` \| `"DELETE"` \| `"HEAD"` \| `"PUT"` \| `"OPTIONS"` \| `"TRACE"` \| `"PATCH"` \| `"ANY"`

HTTP method accepted by the server route.

##### Default

```ts
'POST'
```

#### path?

> `optional` **path?**: `string`

Route path matched by the server.

##### Default

```ts
source file relative path
```

#### timeout?

> `optional` **timeout?**: `number`

Request timeout in milliseconds.

---

### name?

> `optional` **name?**: `string`

Instance name used when mounting multiple HTTP plugins.
