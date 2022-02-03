# Class: ResponseError

## Hierarchy

- `Error`

  ↳ **`ResponseError`**

## Table of contents

### Constructors

- [constructor](ResponseError.md#constructor)

### Properties

- [body](ResponseError.md#body)
- [headers](ResponseError.md#headers)
- [status](ResponseError.md#status)

## Constructors

### constructor

• **new ResponseError**(`__namedParameters`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `Object` |
| `__namedParameters.body` | `any` |
| `__namedParameters.headers` | [`ResponseHeaders`](../#responseheaders) |
| `__namedParameters.message` | `string` |
| `__namedParameters.status` | `number` |

#### Overrides

Error.constructor

## Properties

### body

• `Readonly` **body**: `any`

___

### headers

• `Readonly` **headers**: [`ResponseHeaders`](../#responseheaders)

___

### status

• `Readonly` **status**: `number`
