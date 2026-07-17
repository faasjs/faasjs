[**@faasjs/dev**](../README.md)

[@faasjs/dev](../README.md) / JsonHandlerOptions

# Type Alias: JsonHandlerOptions

> **JsonHandlerOptions** = `object`

Options for HTTP-style JSON API test calls.

## Properties

### cookie?

> `optional` **cookie?**: `object`

Cookie key-value pairs preloaded into the request.

#### Index Signature

\[`key`: `string`\]: `any`

### headers?

> `optional` **headers?**: `object`

Headers merged into the JSON request.

#### Index Signature

\[`key`: `string`\]: `any`

### path?

> `optional` **path?**: `string`

URL pathname used for `event.path`; defaults to the path inferred from the API filename.

### session?

> `optional` **session?**: `object`

Session key-value pairs encoded into the request cookie before invocation.

#### Index Signature

\[`key`: `string`\]: `any`
