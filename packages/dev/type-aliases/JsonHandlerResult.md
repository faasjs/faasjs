[@faasjs/dev](../README.md) / JsonHandlerResult

# Type Alias: JsonHandlerResult\<TData\>

> **JsonHandlerResult**\<`TData`\> = `object`

Normalized HTTP-style response returned by JSON API test helpers.

## Type Parameters

### TData

`TData` = `any`

## Properties

### body

> **body**: `any`

Raw parsed response body.

### cookie?

> `optional` **cookie?**: `Record`\<`string`, `any`\>

Decoded response cookies.

### data?

> `optional` **data?**: `TData`

Successful `data` payload from the FaasJS response envelope.

### error?

> `optional` **error?**: `object`

Error payload from the FaasJS response envelope.

#### message

> **message**: `string`

### headers

> **headers**: `object`

Response headers returned by the HTTP plugin.

#### Index Signature

\[`key`: `string`\]: `string`

### session?

> `optional` **session?**: `Record`\<`string`, `any`\>

Decoded response session values.

### statusCode

> **statusCode**: `number`

HTTP status code returned by the HTTP plugin.
