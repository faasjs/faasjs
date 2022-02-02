# Class: Session<S, C\>

## Type parameters

| Name | Type |
| :------ | :------ |
| `S` | extends `Record`<`string`, `string`\> = `any` |
| `C` | extends `Record`<`string`, `string`\> = `any` |

## Table of contents

### Constructors

- [constructor](Session.md#constructor)

### Properties

- [config](Session.md#config)
- [content](Session.md#content)

### Methods

- [decode](Session.md#decode)
- [encode](Session.md#encode)
- [invoke](Session.md#invoke)
- [read](Session.md#read)
- [update](Session.md#update)
- [write](Session.md#write)

## Constructors

### constructor

• **new Session**<`S`, `C`\>(`cookie`, `config`)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `S` | extends `Record`<`string`, `string`\> = `any` |
| `C` | extends `Record`<`string`, `string`\> = `any` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `cookie` | [`Cookie`](Cookie.md)<`C`, `S`\> |
| `config` | [`SessionOptions`](../modules.md#sessionoptions) |

#### Defined in

[session.ts:41](https://github.com/faasjs/faasjs/blob/1705fd2/packages/http/src/session.ts#L41)

## Properties

### config

• `Readonly` **config**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `cipherName` | `string` |
| `digest` | `string` |
| `iterations` | `number` |
| `key` | `string` |
| `keylen` | `number` |
| `salt` | `string` |
| `secret` | `string` |
| `signedSalt` | `string` |

#### Defined in

[session.ts:25](https://github.com/faasjs/faasjs/blob/1705fd2/packages/http/src/session.ts#L25)

___

### content

• **content**: `Record`<`string`, `string` \| `number`\>

#### Defined in

[session.ts:23](https://github.com/faasjs/faasjs/blob/1705fd2/packages/http/src/session.ts#L23)

## Methods

### decode

▸ **decode**(`text`): `SessionContent`

#### Parameters

| Name | Type |
| :------ | :------ |
| `text` | `string` |

#### Returns

`SessionContent`

#### Defined in

[session.ts:102](https://github.com/faasjs/faasjs/blob/1705fd2/packages/http/src/session.ts#L102)

___

### encode

▸ **encode**(`text`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `text` | `SessionContent` |

#### Returns

`string`

#### Defined in

[session.ts:84](https://github.com/faasjs/faasjs/blob/1705fd2/packages/http/src/session.ts#L84)

___

### invoke

▸ **invoke**(`cookie?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `cookie?` | `string` |

#### Returns

`void`

#### Defined in

[session.ts:74](https://github.com/faasjs/faasjs/blob/1705fd2/packages/http/src/session.ts#L74)

___

### read

▸ **read**(`key`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |

#### Returns

`string`

#### Defined in

[session.ts:127](https://github.com/faasjs/faasjs/blob/1705fd2/packages/http/src/session.ts#L127)

___

### update

▸ **update**(): [`Session`](Session.md)<`S`, `C`\>

#### Returns

[`Session`](Session.md)<`S`, `C`\>

#### Defined in

[session.ts:141](https://github.com/faasjs/faasjs/blob/1705fd2/packages/http/src/session.ts#L141)

___

### write

▸ **write**(`key`, `value?`): [`Session`](Session.md)<`S`, `C`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |
| `value?` | `string` \| `number` |

#### Returns

[`Session`](Session.md)<`S`, `C`\>

#### Defined in

[session.ts:131](https://github.com/faasjs/faasjs/blob/1705fd2/packages/http/src/session.ts#L131)
