[@faasjs/react](../README.md) / ResponseError

# Class: ResponseError

ResponseError class

Example:
```ts
new ResponseError({
  status: 404,
  message: 'Not Found',
})
```

## Extends

- `Error`

## Constructors

### new ResponseError()

> **new ResponseError**(`__namedParameters`): [`ResponseError`](ResponseError.md)

#### Parameters

##### \_\_namedParameters

###### body

`any`

###### headers

[`ResponseHeaders`](../type-aliases/ResponseHeaders.md)

###### message

`string`

###### status

`number`

#### Returns

[`ResponseError`](ResponseError.md)

#### Overrides

`Error.constructor`

## Properties

### body

> `readonly` **body**: `any`

### headers

> `readonly` **headers**: [`ResponseHeaders`](../type-aliases/ResponseHeaders.md)

### status

> `readonly` **status**: `number`
