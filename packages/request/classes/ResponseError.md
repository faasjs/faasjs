[@faasjs/request](../README.md) / ResponseError

# Class: ResponseError

ResponseError class

## Extends

- `Error`

## Constructors

### Constructor

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

### request

> **request**: [`Request`](../type-aliases/Request.md) \| `undefined`

### response

> **response**: [`Response`](../type-aliases/Response.md)

### statusCode

> **statusCode**: `number`

### statusMessage

> **statusMessage**: `string`
