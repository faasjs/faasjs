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
| `config.cookie?` | [`ValidatorOptions`](../#validatoroptions)<`TCookie`\> |
| `config.params?` | [`ValidatorOptions`](../#validatoroptions)<`TParams`\> |
| `config.session?` | [`ValidatorOptions`](../#validatoroptions)<`TSession`\> |
| `logger` | `Logger` |

## Properties

### before

• `Optional` **before**: `BeforeOption`<`TParams`, `TCookie`, `TSession`\>

___

### cookieConfig

• `Optional` **cookieConfig**: [`ValidatorOptions`](../#validatoroptions)<`TCookie`\>

___

### paramsConfig

• `Optional` **paramsConfig**: [`ValidatorOptions`](../#validatoroptions)<`TParams`\>

___

### sessionConfig

• `Optional` **sessionConfig**: [`ValidatorOptions`](../#validatoroptions)<`TSession`\>

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
| `config` | [`ValidatorOptions`](../#validatoroptions)<`Record`<`string`, `any`\>\> |

#### Returns

`void`
