# Class: ResponseError

ResponseError class

Example:
```ts
new ResponseError({
  status: 404,
  message: 'Not Found',
})
```

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

• **new ResponseError**(`«destructured»`): [`ResponseError`](ResponseError.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `body` | `any` |
| › `headers` | [`ResponseHeaders`](../#responseheaders) |
| › `message` | `string` |
| › `status` | `number` |

#### Returns

[`ResponseError`](ResponseError.md)

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
