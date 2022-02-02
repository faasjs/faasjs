# Class: Cookie<C, S\>

## Type parameters

| Name | Type |
| :------ | :------ |
| `C` | extends `Record`<`string`, `string`\> = `any` |
| `S` | extends `Record`<`string`, `string`\> = `any` |

## Table of contents

### Constructors

- [constructor](Cookie.md#constructor)

### Properties

- [config](Cookie.md#config)
- [content](Cookie.md#content)
- [session](Cookie.md#session)

### Methods

- [headers](Cookie.md#headers)
- [invoke](Cookie.md#invoke)
- [read](Cookie.md#read)
- [write](Cookie.md#write)

## Constructors

### constructor

• **new Cookie**<`C`, `S`\>(`config`)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `C` | extends `Record`<`string`, `string`\> = `any` |
| `S` | extends `Record`<`string`, `string`\> = `any` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `config` | [`CookieOptions`](../modules.md#cookieoptions) |

## Properties

### config

• `Readonly` **config**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `domain?` | `string` |
| `expires` | `number` |
| `httpOnly` | `boolean` |
| `path` | `string` |
| `sameSite?` | ``"Strict"`` \| ``"Lax"`` \| ``"None"`` |
| `secure` | `boolean` |
| `session` | [`SessionOptions`](../modules.md#sessionoptions) |

___

### content

• **content**: `Record`<`string`, `string`\>

___

### session

• **session**: [`Session`](Session.md)<`S`, `C`\>

## Methods

### headers

▸ **headers**(): `Object`

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `Set-Cookie?` | `string`[] |

___

### invoke

▸ **invoke**(`cookie`): [`Cookie`](Cookie.md)<`C`, `S`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `cookie` | `string` |

#### Returns

[`Cookie`](Cookie.md)<`C`, `S`\>

___

### read

▸ **read**(`key`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |

#### Returns

`any`

___

### write

▸ **write**(`key`, `value`, `opts?`): [`Cookie`](Cookie.md)<`C`, `S`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |
| `value` | `string` |
| `opts?` | `Object` |
| `opts.domain?` | `string` |
| `opts.expires?` | `string` \| `number` |
| `opts.httpOnly?` | `boolean` |
| `opts.path?` | `string` |
| `opts.sameSite?` | ``"Strict"`` \| ``"Lax"`` \| ``"None"`` |
| `opts.secure?` | `boolean` |

#### Returns

[`Cookie`](Cookie.md)<`C`, `S`\>
