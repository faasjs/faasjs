[@faasjs/http](../README.md) / Validator

# Class: Validator\<TParams, TCookie, TSession\>

## Type parameters

• **TParams** extends `Record`\<`string`, `any`\> = `any`

• **TCookie** extends `Record`\<`string`, `string`\> = `any`

• **TSession** extends `Record`\<`string`, `string`\> = `any`

## Constructors

### new Validator(config)

> **new Validator**\<`TParams`, `TCookie`, `TSession`\>(`config`): [`Validator`](Validator.md)\<`TParams`, `TCookie`, `TSession`\>

#### Parameters

• **config**: [`ValidatorConfig`](../type-aliases/ValidatorConfig.md)\<`TParams`, `TCookie`, `TSession`\>

#### Returns

[`Validator`](Validator.md)\<`TParams`, `TCookie`, `TSession`\>

## Properties

### before?

> **before**?: `BeforeOption`\<`TParams`, `TCookie`, `TSession`\>

### cookieConfig?

> **cookieConfig**?: [`ValidatorOptions`](../type-aliases/ValidatorOptions.md)\<`TCookie`\>

### paramsConfig?

> **paramsConfig**?: [`ValidatorOptions`](../type-aliases/ValidatorOptions.md)\<`TParams`\>

### sessionConfig?

> **sessionConfig**?: [`ValidatorOptions`](../type-aliases/ValidatorOptions.md)\<`TSession`\>

## Methods

### valid()

> **valid**(`request`, `logger`): `Promise`\<`void`\>

#### Parameters

• **request**: `Request`\<`TParams`, `TCookie`, `TSession`\>

• **logger**: `Logger`

#### Returns

`Promise`\<`void`\>

### validContent()

> **validContent**(`type`, `params`, `baseKey`, `config`, `logger`): `void`

#### Parameters

• **type**: `string`

• **params**: `Object`

• **baseKey**: `string`

• **config**: [`ValidatorOptions`](../type-aliases/ValidatorOptions.md)\<`Record`\<`string`, `any`\>\>

• **logger**: `Logger`

#### Returns

`void`
