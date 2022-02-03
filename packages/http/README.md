# @faasjs/http

[![License: MIT](https://img.shields.io/npm/l/@faasjs/http.svg)](https://github.com/faasjs/faasjs/blob/main/packages/faasjs/http/LICENSE)
[![NPM Stable Version](https://img.shields.io/npm/v/@faasjs/http/stable.svg)](https://www.npmjs.com/package/@faasjs/http)
[![NPM Beta Version](https://img.shields.io/npm/v/@faasjs/http/beta.svg)](https://www.npmjs.com/package/@faasjs/http)

FaasJS's http plugin.

## Install

    npm install @faasjs/http

## Modules

### Classes

- [Cookie](classes/Cookie.md)
- [Http](classes/Http.md)
- [HttpError](classes/HttpError.md)
- [Session](classes/Session.md)
- [Validator](classes/Validator.md)

### Type aliases

- [CookieOptions](modules.md#cookieoptions)
- [HttpConfig](modules.md#httpconfig)
- [Response](modules.md#response)
- [SessionOptions](modules.md#sessionoptions)
- [ValidatorConfig](modules.md#validatorconfig)
- [ValidatorOptions](modules.md#validatoroptions)
- [ValidatorRuleOptions](modules.md#validatorruleoptions)

### Variables

- [ContentType](modules.md#contenttype)

### Functions

- [useHttp](modules.md#usehttp)

## Type aliases

### CookieOptions

Ƭ **CookieOptions**: `Object`

#### Index signature

▪ [key: `string`]: `any`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `domain?` | `string` |
| `expires?` | `number` |
| `httpOnly?` | `boolean` |
| `path?` | `string` |
| `sameSite?` | ``"Strict"`` \| ``"Lax"`` \| ``"None"`` |
| `secure?` | `boolean` |
| `session?` | [`SessionOptions`](modules.md#sessionoptions) |

___

### HttpConfig

Ƭ **HttpConfig**<`TParams`, `TCookie`, `TSession`\>: `Object`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TParams` | extends `Record`<`string`, `any`\> = `any` |
| `TCookie` | extends `Record`<`string`, `string`\> = `any` |
| `TSession` | extends `Record`<`string`, `string`\> = `any` |

#### Index signature

▪ [key: `string`]: `any`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `config?` | `Object` |
| `config.cookie?` | [`CookieOptions`](modules.md#cookieoptions) |
| `config.functionName?` | `string` |
| `config.ignorePathPrefix?` | `string` |
| `config.method?` | ``"BEGIN"`` \| ``"GET"`` \| ``"POST"`` \| ``"DELETE"`` \| ``"HEAD"`` \| ``"PUT"`` \| ``"OPTIONS"`` \| ``"TRACE"`` \| ``"PATCH"`` \| ``"ANY"`` |
| `config.path?` | `string` |
| `config.timeout?` | `number` |
| `name?` | `string` |
| `validator?` | [`ValidatorConfig`](modules.md#validatorconfig)<`TParams`, `TCookie`, `TSession`\> |

___

### Response

Ƭ **Response**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `body?` | `string` |
| `headers?` | `Object` |
| `message?` | `string` |
| `statusCode?` | `number` |

___

### SessionOptions

Ƭ **SessionOptions**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `cipherName?` | `string` |
| `digest?` | `string` |
| `iterations?` | `number` |
| `key` | `string` |
| `keylen?` | `number` |
| `salt?` | `string` |
| `secret` | `string` |
| `signedSalt?` | `string` |

___

### ValidatorConfig

Ƭ **ValidatorConfig**<`TParams`, `TCookie`, `TSession`\>: `Object`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TParams` | extends `Record`<`string`, `any`\> = `any` |
| `TCookie` | extends `Record`<`string`, `string`\> = `any` |
| `TSession` | extends `Record`<`string`, `string`\> = `any` |

#### Type declaration

| Name | Type |
| :------ | :------ |
| `before?` | `BeforeOption` |
| `cookie?` | [`ValidatorOptions`](modules.md#validatoroptions)<`TCookie`\> |
| `params?` | [`ValidatorOptions`](modules.md#validatoroptions)<`TParams`\> |
| `session?` | [`ValidatorOptions`](modules.md#validatoroptions)<`TSession`\> |

___

### ValidatorOptions

Ƭ **ValidatorOptions**<`Content`\>: `Object`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Content` | `Record`<`string`, `any`\> |

#### Type declaration

| Name | Type |
| :------ | :------ |
| `rules` | { [k in keyof Content]?: ValidatorRuleOptions } |
| `whitelist?` | ``"error"`` \| ``"ignore"`` |
| `onError?` | (`type`: `string`, `key`: `string` \| `string`[], `value?`: `any`) => `void` \| { `message`: `any` ; `statusCode?`: `number`  } |

___

### ValidatorRuleOptions

Ƭ **ValidatorRuleOptions**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `config?` | `Partial`<[`ValidatorOptions`](modules.md#validatoroptions)\> |
| `default?` | `any` |
| `in?` | `any`[] |
| `regexp?` | `RegExp` |
| `required?` | `boolean` |
| `type?` | `ValidatorRuleOptionsType` |

## Variables

### ContentType

• **ContentType**: `Object`

#### Index signature

▪ [key: `string`]: `string`

## Functions

### useHttp

▸ **useHttp**<`TParams`, `TCookie`, `TSession`\>(`config?`): [`Http`](classes/Http.md)<`TParams`, `TCookie`, `TSession`\> & `UseifyPlugin`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TParams` | extends `Record`<`string`, `any`\> = `any` |
| `TCookie` | extends `Record`<`string`, `string`\> = `any` |
| `TSession` | extends `Record`<`string`, `string`\> = `any` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `config?` | [`HttpConfig`](modules.md#httpconfig)<`TParams`, `TCookie`, `TSession`\> |

#### Returns

[`Http`](classes/Http.md)<`TParams`, `TCookie`, `TSession`\> & `UseifyPlugin`
