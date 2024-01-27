[@faasjs/vue-plugin](../README.md) / ResponseError

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

### new ResponseError(__namedParameters)

> **new ResponseError**(`__namedParameters`): [`ResponseError`](ResponseError.md)

#### Parameters

• **\_\_namedParameters**: `Object`

• **\_\_namedParameters\.body**: `any`

• **\_\_namedParameters\.headers**: [`ResponseHeaders`](../type-aliases/ResponseHeaders.md)

• **\_\_namedParameters\.message**: `string`

• **\_\_namedParameters\.status**: `number`

#### Returns

[`ResponseError`](ResponseError.md)

#### Overrides

`Error.constructor`

## Properties

### body

> **`readonly`** **body**: `any`

### headers

> **`readonly`** **headers**: [`ResponseHeaders`](../type-aliases/ResponseHeaders.md)

### status

> **`readonly`** **status**: `number`
