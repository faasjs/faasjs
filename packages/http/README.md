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

### Type Aliases

- [CookieOptions](#cookieoptions)
- [HttpConfig](#httpconfig)
- [Response](#response)
- [SessionOptions](#sessionoptions)
- [ValidatorConfig](#validatorconfig)
- [ValidatorOptions](#validatoroptions)
- [ValidatorRuleOptions](#validatorruleoptions)

### Variables

- [ContentType](#contenttype)

### Functions

- [useHttp](#usehttp)

## Type Aliases

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
| `session?` | [`SessionOptions`](#sessionoptions) |

___

### HttpConfig

Ƭ **HttpConfig**\<`TParams`, `TCookie`, `TSession`\>: `Object`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TParams` | extends `Record`\<`string`, `any`\> = `any` |
| `TCookie` | extends `Record`\<`string`, `string`\> = `any` |
| `TSession` | extends `Record`\<`string`, `string`\> = `any` |

#### Index signature

▪ [key: `string`]: `any`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `config?` | \{ `[key: string]`: `any`; `cookie?`: [`CookieOptions`](#cookieoptions) ; `functionName?`: `string` ; `ignorePathPrefix?`: `string` ; `method?`: ``"BEGIN"`` \| ``"GET"`` \| ``"POST"`` \| ``"DELETE"`` \| ``"HEAD"`` \| ``"PUT"`` \| ``"OPTIONS"`` \| ``"TRACE"`` \| ``"PATCH"`` \| ``"ANY"`` ; `path?`: `string` ; `timeout?`: `number`  } |
| `config.cookie?` | [`CookieOptions`](#cookieoptions) |
| `config.functionName?` | `string` |
| `config.ignorePathPrefix?` | `string` |
| `config.method?` | ``"BEGIN"`` \| ``"GET"`` \| ``"POST"`` \| ``"DELETE"`` \| ``"HEAD"`` \| ``"PUT"`` \| ``"OPTIONS"`` \| ``"TRACE"`` \| ``"PATCH"`` \| ``"ANY"`` |
| `config.path?` | `string` |
| `config.timeout?` | `number` |
| `name?` | `string` |
| `validator?` | [`ValidatorConfig`](#validatorconfig)\<`TParams`, `TCookie`, `TSession`\> |

___

### Response

Ƭ **Response**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `body?` | `string` |
| `headers?` | \{ `[key: string]`: `string`;  } |
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

Ƭ **ValidatorConfig**\<`TParams`, `TCookie`, `TSession`\>: `Object`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TParams` | extends `Record`\<`string`, `any`\> = `any` |
| `TCookie` | extends `Record`\<`string`, `string`\> = `any` |
| `TSession` | extends `Record`\<`string`, `string`\> = `any` |

#### Type declaration

| Name | Type |
| :------ | :------ |
| `before?` | `BeforeOption` |
| `cookie?` | [`ValidatorOptions`](#validatoroptions)\<`TCookie`\> |
| `params?` | [`ValidatorOptions`](#validatoroptions)\<`TParams`\> |
| `session?` | [`ValidatorOptions`](#validatoroptions)\<`TSession`\> |

___

### ValidatorOptions

Ƭ **ValidatorOptions**\<`Content`\>: `Object`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Content` | `Record`\<`string`, `any`\> |

#### Type declaration

| Name | Type |
| :------ | :------ |
| `onError?` | (`type`: `string`, `key`: `string` \| `string`[], `value?`: `any`) => \{ `message`: `any` ; `statusCode?`: `number`  } \| `void` |
| `rules` | \{ [k in keyof Content]?: ValidatorRuleOptions } |
| `whitelist?` | ``"error"`` \| ``"ignore"`` |

___

### ValidatorRuleOptions

Ƭ **ValidatorRuleOptions**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `config?` | `Partial`\<[`ValidatorOptions`](#validatoroptions)\> |
| `default?` | `any` |
| `in?` | `any`[] |
| `regexp?` | `RegExp` |
| `required?` | `boolean` |
| `type?` | `ValidatorRuleOptionsType` |

## Variables

### ContentType

• `Const` **ContentType**: `Object`

#### Index signature

▪ [key: `string`]: `string`

## Functions

### useHttp

▸ **useHttp**\<`TParams`, `TCookie`, `TSession`\>(`config?`): `UseifyPlugin`\<[`Http`](classes/Http.md)\<`TParams`, `TCookie`, `TSession`\>\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `TParams` | extends `Record`\<`string`, `any`\> = `any` |
| `TCookie` | extends `Record`\<`string`, `string`\> = `any` |
| `TSession` | extends `Record`\<`string`, `string`\> = `any` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `config?` | [`HttpConfig`](#httpconfig)\<`TParams`, `TCookie`, `TSession`\> |

#### Returns

`UseifyPlugin`\<[`Http`](classes/Http.md)\<`TParams`, `TCookie`, `TSession`\>\>
