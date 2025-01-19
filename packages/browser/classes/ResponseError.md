[@faasjs/browser](../README.md) / ResponseError

# Class: ResponseError

Custom error class to handle HTTP response errors.

 ResponseError

## Param

The error message, an Error object, or a ResponseErrorProps object.

## Param

Additional options for the error.

## Example

```ts
new ResponseError('error message')
new ResponseError(new Error('error message'))
new ResponseError({ message: 'not found', status: 404 })
```

## Extends

- `Error`

## Constructors

### new ResponseError()

> **new ResponseError**(`msg`, `options`?): [`ResponseError`](ResponseError.md)

#### Parameters

##### msg

`string` | `Error`

##### options?

`Omit`\<[`ResponseErrorProps`](../type-aliases/ResponseErrorProps.md), `"message"` \| `"originalError"`\>

#### Returns

[`ResponseError`](ResponseError.md)

#### Overrides

`Error.constructor`

### new ResponseError()

> **new ResponseError**(`props`): [`ResponseError`](ResponseError.md)

#### Parameters

##### props

[`ResponseErrorProps`](../type-aliases/ResponseErrorProps.md)

#### Returns

[`ResponseError`](ResponseError.md)

#### Overrides

`Error.constructor`

## Properties

### body

> `readonly` **body**: `any`

The body of the response, or the original error if available.

### headers

> `readonly` **headers**: [`ResponseHeaders`](../type-aliases/ResponseHeaders.md)

The headers of the response.

### originalError?

> `readonly` `optional` **originalError**: `Error`

The original error, if any.

### status

> `readonly` **status**: `number`

The HTTP status code of the response.
