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
| `config` | [`SessionOptions`](../#sessionoptions) |

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

___

### content

• **content**: `Record`<`string`, `string` \| `number`\>

## Methods

### decode

▸ **decode**(`text`): `SessionContent`

#### Parameters

| Name | Type |
| :------ | :------ |
| `text` | `string` |

#### Returns

`SessionContent`

___

### encode

▸ **encode**(`text`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `text` | `SessionContent` |

#### Returns

`string`

___

### invoke

▸ **invoke**(`cookie?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `cookie?` | `string` |

#### Returns

`void`

___

### read

▸ **read**(`key`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |

#### Returns

`string`

___

### update

▸ **update**(): [`Session`](Session.md)<`S`, `C`\>

#### Returns

[`Session`](Session.md)<`S`, `C`\>

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
