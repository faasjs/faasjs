[@faasjs/react](../README.md) / ResponseError

# Class: ResponseError

Custom error class for handling HTTP response errors from FaasJS requests.

Extends the built-in Error class to provide additional information about failed requests,
including HTTP status code, response headers, response body, and the original error.

## Extends

- `Error`

## Constructors

### Constructor

> **new ResponseError**(`data`, `options?`): `ResponseError`

Create a ResponseError from a message, Error, or structured response error payload.

#### Parameters

##### data

`string` \| `Error`

##### options?

`Omit`\<[`ResponseErrorProps`](../type-aliases/ResponseErrorProps.md), `"message"` \| `"originalError"`\>

#### Returns

`ResponseError`

#### Overrides

`Error.constructor`

### Constructor

> **new ResponseError**(`data`): `ResponseError`

#### Parameters

##### data

[`ResponseErrorProps`](../type-aliases/ResponseErrorProps.md)

#### Returns

`ResponseError`

#### Overrides

`Error.constructor`

## Properties

### body

> `readonly` **body**: `any`

Raw error body or fallback error payload.

### headers

> `readonly` **headers**: [`ResponseHeaders`](../type-aliases/ResponseHeaders.md)

Response headers returned with the error.

### originalError?

> `readonly` `optional` **originalError?**: `Error`

Original error used to construct this instance, when available.

### status

> `readonly` **status**: `number`

HTTP status code reported for the failed request.
