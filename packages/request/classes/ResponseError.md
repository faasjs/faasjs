[@faasjs/request](../README.md) / ResponseError

# Class: ResponseError

ResponseError class

## Extends

- `Error`

## Constructors

### new ResponseError()

> **new ResponseError**(`message`, `response`): `ResponseError`

#### Parameters

##### message

`string`

##### response

[`Response`](../type-aliases/Response.md)\<`any`\>

#### Returns

`ResponseError`

#### Overrides

`Error.constructor`

## Properties

### body

> **body**: `any`

### headers

> **headers**: `OutgoingHttpHeaders`

### request?

> `optional` **request**: [`Request`](../type-aliases/Request.md)

### response

> **response**: [`Response`](../type-aliases/Response.md)

### statusCode?

> `optional` **statusCode**: `number`

### statusMessage?

> `optional` **statusMessage**: `string`
