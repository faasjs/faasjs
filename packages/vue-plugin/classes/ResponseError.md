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
| `__namedParameters.headers` | [`ResponseHeaders`](../modules.md#responseheaders) |
| `__namedParameters.message` | `string` |
| `__namedParameters.status` | `number` |

#### Overrides

Error.constructor

#### Defined in

[browser/src/index.ts:48](https://github.com/faasjs/faasjs/blob/1705fd2/packages/browser/src/index.ts#L48)

## Properties

### body

• `Readonly` **body**: `any`

#### Defined in

[browser/src/index.ts:46](https://github.com/faasjs/faasjs/blob/1705fd2/packages/browser/src/index.ts#L46)

___

### headers

• `Readonly` **headers**: [`ResponseHeaders`](../modules.md#responseheaders)

#### Defined in

[browser/src/index.ts:45](https://github.com/faasjs/faasjs/blob/1705fd2/packages/browser/src/index.ts#L45)

___

### status

• `Readonly` **status**: `number`

#### Defined in

[browser/src/index.ts:44](https://github.com/faasjs/faasjs/blob/1705fd2/packages/browser/src/index.ts#L44)
