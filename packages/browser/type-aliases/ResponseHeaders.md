[@faasjs/browser](../README.md) / ResponseHeaders

# Type Alias: ResponseHeaders

> **ResponseHeaders** = `object`

Simple key-value object for HTTP response headers.

Represents headers as a plain object with string keys and string values.
Used by Response, ResponseError, and Options types.

## Index Signature

\[`key`: `string`\]: `string`

## Remarks

- Headers are case-insensitive in HTTP but stored with exact casing in this object
- Common headers include: Content-Type, Authorization, X-Request-Id, X-Custom-Header
- No support for multi-value headers (use comma-separated values instead)
- Used in Response, ResponseError, and Options types
- Simplified model compared to browser's Headers interface (no .get(), .set() methods)

## See

- Response for usage in response objects
- ResponseError for usage in error objects
- Options for usage in request options
