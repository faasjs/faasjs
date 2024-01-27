[@faasjs/request](../README.md) / ResponseError

# Class: ResponseError

ResponseError class

## Extends

- `Error`

## Constructors

### new ResponseError(message, response)

> **new ResponseError**(`message`, `response`): [`ResponseError`](ResponseError.md)

#### Parameters

• **message**: `string`

• **response**: [`Response`](../type-aliases/Response.md)\<`any`\>

#### Returns

[`ResponseError`](ResponseError.md)

#### Overrides

`Error.constructor`

## Properties

### body

> **body**: `any`

### headers

> **headers**: `OutgoingHttpHeaders`

### request

> **request**: [`Request`](../type-aliases/Request.md)

### response

> **response**: [`Response`](../type-aliases/Response.md)\<`any`\>

### statusCode

> **statusCode**: `number`

### statusMessage

> **statusMessage**: `string`
