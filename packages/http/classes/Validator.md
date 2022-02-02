# Class: Validator<TParams, TCookie, TSession\>

## Type parameters

| Name | Type |
| :------ | :------ |
| `TParams` | extends `Record`<`string`, `any`\> = `any` |
| `TCookie` | extends `Record`<`string`, `string`\> = `any` |
| `TSession` | extends `Record`<`string`, `string`\> = `any` |

## Table of contents

### Constructors

- [constructor](Validator.md#constructor)

### Properties

- [before](Validator.md#before)
- [cookieConfig](Validator.md#cookieconfig)
- [paramsConfig](Validator.md#paramsconfig)
- [sessionConfig](Validator.md#sessionconfig)

### Methods

- [valid](Validator.md#valid)
- [validContent](Validator.md#validcontent)

## Constructors

### constructor

• **new Validator**<`TParams`, `TCookie`, `TSession`\>(`config`, `logger`)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TParams` | extends `Record`<`string`, `any`\> = `any` |
| `TCookie` | extends `Record`<`string`, `string`\> = `any` |
| `TSession` | extends `Record`<`string`, `string`\> = `any` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `config` | `Object` |
| `config.before?` | `BeforeOption`<`TParams`, `TCookie`, `TSession`\> |
| `config.cookie?` | [`ValidatorOptions`](../modules.md#validatoroptions)<`TCookie`\> |
| `config.params?` | [`ValidatorOptions`](../modules.md#validatoroptions)<`TParams`\> |
| `config.session?` | [`ValidatorOptions`](../modules.md#validatoroptions)<`TSession`\> |
| `logger` | `Logger` |

#### Defined in

[validator.ts:82](https://github.com/faasjs/faasjs/blob/1705fd2/packages/http/src/validator.ts#L82)

## Properties

### before

• `Optional` **before**: `BeforeOption`<`TParams`, `TCookie`, `TSession`\>

#### Defined in

[validator.ts:75](https://github.com/faasjs/faasjs/blob/1705fd2/packages/http/src/validator.ts#L75)

___

### cookieConfig

• `Optional` **cookieConfig**: [`ValidatorOptions`](../modules.md#validatoroptions)<`TCookie`\>

#### Defined in

[validator.ts:77](https://github.com/faasjs/faasjs/blob/1705fd2/packages/http/src/validator.ts#L77)

___

### paramsConfig

• `Optional` **paramsConfig**: [`ValidatorOptions`](../modules.md#validatoroptions)<`TParams`\>

#### Defined in

[validator.ts:76](https://github.com/faasjs/faasjs/blob/1705fd2/packages/http/src/validator.ts#L76)

___

### sessionConfig

• `Optional` **sessionConfig**: [`ValidatorOptions`](../modules.md#validatoroptions)<`TSession`\>

#### Defined in

[validator.ts:78](https://github.com/faasjs/faasjs/blob/1705fd2/packages/http/src/validator.ts#L78)

## Methods

### valid

▸ **valid**(`request`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `request` | `Request`<`TParams`, `TCookie`, `TSession`\> |

#### Returns

`Promise`<`void`\>

#### Defined in

[validator.ts:98](https://github.com/faasjs/faasjs/blob/1705fd2/packages/http/src/validator.ts#L98)

___

### validContent

▸ **validContent**(`type`, `params`, `baseKey`, `config`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | `string` |
| `params` | `Object` |
| `baseKey` | `string` |
| `config` | [`ValidatorOptions`](../modules.md#validatoroptions)<`Record`<`string`, `any`\>\> |

#### Returns

`void`

#### Defined in

[validator.ts:138](https://github.com/faasjs/faasjs/blob/1705fd2/packages/http/src/validator.ts#L138)
