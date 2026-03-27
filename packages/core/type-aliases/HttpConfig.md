[@faasjs/core](../README.md) / HttpConfig

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

#### functionName?

> `optional` **functionName?**: `string`

#### ignorePathPrefix?

> `optional` **ignorePathPrefix?**: `string`

#### method?

> `optional` **method?**: `"BEGIN"` \| `"GET"` \| `"POST"` \| `"DELETE"` \| `"HEAD"` \| `"PUT"` \| `"OPTIONS"` \| `"TRACE"` \| `"PATCH"` \| `"ANY"`

POST as default

#### path?

> `optional` **path?**: `string`

file relative path as default

#### timeout?

> `optional` **timeout?**: `number`

### name?

> `optional` **name?**: `string`

Instance name used when mounting multiple HTTP plugins.
