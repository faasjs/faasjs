[**@faasjs/react**](../README.md)

[@faasjs/react](../README.md) / Response

# Class: Response\<T\>

Wrapper class for HTTP responses from FaasJS functions.

Provides a consistent interface for handling server responses with status code, headers,
body, and parsed data. Automatically handles JSON serialization and status code defaults.

## Type Parameters

### T

`T` = `any`

The type of the data property for type-safe response handling

## Constructors

### Constructor

> **new Response**\<`T`>>>>\>(`props?`): `Response`\<`T`>>>>\>

Create a wrapped response object.

#### Parameters

##### props?

[`ResponseProps`](../type-aliases/ResponseProps.md)\<`T`\> = `{}`

#### Returns

`Response`\<`T`\>

## Properties

### body

> `readonly` **body**: `any`

Raw response body.

### data?

> `readonly` `optional` **data?**: `T`

Parsed response payload when JSON data is available.

### headers

> `readonly` **headers**: [`ResponseHeaders`](../type-aliases/ResponseHeaders.md)

Response headers keyed by header name.

### status

> `readonly` **status**: `number`

HTTP status code exposed to callers.
