[@faasjs/core](../README.md) / Response

# Type Alias: Response

> **Response** = `object`

Serializable HTTP response shape produced by FaasJS HTTP handlers.

## Properties

### body?

> `optional` **body?**: `string` \| `ReadableStream`

Plain string body or stream payload.

### headers?

> `optional` **headers?**: `object`

Response headers keyed by header name.

#### Index Signature

\[`key`: `string`\]: `string`

### message?

> `optional` **message?**: `string`

Optional response message.

### statusCode?

> `optional` **statusCode?**: `number`

HTTP status code to send.
