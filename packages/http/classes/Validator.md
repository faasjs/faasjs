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

## Properties

### before

• `Optional` **before**: `BeforeOption`<`TParams`, `TCookie`, `TSession`\>

___

### cookieConfig

• `Optional` **cookieConfig**: [`ValidatorOptions`](../modules.md#validatoroptions)<`TCookie`\>

___

### paramsConfig

• `Optional` **paramsConfig**: [`ValidatorOptions`](../modules.md#validatoroptions)<`TParams`\>

___

### sessionConfig

• `Optional` **sessionConfig**: [`ValidatorOptions`](../modules.md#validatoroptions)<`TSession`\>

## Methods

### valid

▸ **valid**(`request`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `request` | `Request`<`TParams`, `TCookie`, `TSession`\> |

#### Returns

`Promise`<`void`\>

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
