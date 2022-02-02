# @faasjs/http

## Table of contents

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

#### Defined in

[cookie.ts:4](https://github.com/faasjs/faasjs/blob/1705fd2/packages/http/src/cookie.ts#L4)

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

#### Defined in

[index.ts:34](https://github.com/faasjs/faasjs/blob/1705fd2/packages/http/src/index.ts#L34)

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

#### Defined in

[index.ts:53](https://github.com/faasjs/faasjs/blob/1705fd2/packages/http/src/index.ts#L53)

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

#### Defined in

[session.ts:6](https://github.com/faasjs/faasjs/blob/1705fd2/packages/http/src/session.ts#L6)

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

#### Defined in

[validator.ts:59](https://github.com/faasjs/faasjs/blob/1705fd2/packages/http/src/validator.ts#L59)

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

#### Defined in

[validator.ts:22](https://github.com/faasjs/faasjs/blob/1705fd2/packages/http/src/validator.ts#L22)

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

#### Defined in

[validator.ts:13](https://github.com/faasjs/faasjs/blob/1705fd2/packages/http/src/validator.ts#L13)

## Variables

### ContentType

• **ContentType**: `Object`

#### Index signature

▪ [key: `string`]: `string`

#### Defined in

[index.ts:21](https://github.com/faasjs/faasjs/blob/1705fd2/packages/http/src/index.ts#L21)

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

#### Defined in

[index.ts:353](https://github.com/faasjs/faasjs/blob/1705fd2/packages/http/src/index.ts#L353)
