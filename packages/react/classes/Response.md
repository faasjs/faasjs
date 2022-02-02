# Class: Response<T\>

## Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |

## Table of contents

### Constructors

- [constructor](Response.md#constructor)

### Properties

- [body](Response.md#body)
- [data](Response.md#data)
- [headers](Response.md#headers)
- [status](Response.md#status)

## Constructors

### constructor

• **new Response**<`T`\>(`__namedParameters`)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `Object` |
| `__namedParameters.body?` | `any` |
| `__namedParameters.data?` | `T` |
| `__namedParameters.headers` | [`ResponseHeaders`](../modules.md#responseheaders) |
| `__namedParameters.status` | `number` |

#### Defined in

[browser/src/index.ts:28](https://github.com/faasjs/faasjs/blob/1705fd2/packages/browser/src/index.ts#L28)

## Properties

### body

• `Readonly` **body**: `any`

#### Defined in

[browser/src/index.ts:25](https://github.com/faasjs/faasjs/blob/1705fd2/packages/browser/src/index.ts#L25)

___

### data

• `Readonly` **data**: `T`

#### Defined in

[browser/src/index.ts:26](https://github.com/faasjs/faasjs/blob/1705fd2/packages/browser/src/index.ts#L26)

___

### headers

• `Readonly` **headers**: [`ResponseHeaders`](../modules.md#responseheaders)

#### Defined in

[browser/src/index.ts:24](https://github.com/faasjs/faasjs/blob/1705fd2/packages/browser/src/index.ts#L24)

___

### status

• `Readonly` **status**: `number`

#### Defined in

[browser/src/index.ts:23](https://github.com/faasjs/faasjs/blob/1705fd2/packages/browser/src/index.ts#L23)
