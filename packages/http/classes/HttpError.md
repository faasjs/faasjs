# Class: HttpError

## Hierarchy

- `Error`

  ↳ **`HttpError`**

## Table of contents

### Constructors

- [constructor](HttpError.md#constructor)

### Properties

- [message](HttpError.md#message)
- [statusCode](HttpError.md#statuscode)

## Constructors

### constructor

• **new HttpError**(`__namedParameters`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `Object` |
| `__namedParameters.message` | `string` |
| `__namedParameters.statusCode?` | `number` |

#### Overrides

Error.constructor

#### Defined in

[index.ts:66](https://github.com/faasjs/faasjs/blob/1705fd2/packages/http/src/index.ts#L66)

## Properties

### message

• `Readonly` **message**: `string`

#### Overrides

Error.message

#### Defined in

[index.ts:64](https://github.com/faasjs/faasjs/blob/1705fd2/packages/http/src/index.ts#L64)

___

### statusCode

• `Readonly` **statusCode**: `number`

#### Defined in

[index.ts:63](https://github.com/faasjs/faasjs/blob/1705fd2/packages/http/src/index.ts#L63)
