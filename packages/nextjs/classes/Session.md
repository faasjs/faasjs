[@faasjs/nextjs](../README.md) / Session

# Class: Session

## Constructors

### new Session()

> **new Session**(`config`): [`Session`](Session.md)

#### Parameters

• **config**: [`SessionOptions`](../type-aliases/SessionOptions.md)

#### Returns

[`Session`](Session.md)

## Properties

### config

> `readonly` **config**: `object`

#### cipherName

> **cipherName**: `string`

#### digest

> **digest**: `string`

#### iterations

> **iterations**: `number`

#### key

> **key**: `string`

#### keylen

> **keylen**: `number`

#### salt

> **salt**: `string`

#### secret

> **secret**: `string`

#### signedSalt

> **signedSalt**: `string`

## Methods

### decode()

> **decode**\<`T`\>(`text`): `T`

#### Type Parameters

• **T** *extends* `Record`\<`string`, [`SessionContent`](../type-aliases/SessionContent.md)\> = `any`

#### Parameters

• **text**: `string`

#### Returns

`T`

***

### encode()

> **encode**(`text`): `string`

#### Parameters

• **text**: [`SessionContent`](../type-aliases/SessionContent.md)

#### Returns

`string`

***

### get()

> **get**\<`T`\>(): `T`

#### Type Parameters

• **T** *extends* `Record`\<`string`, [`SessionContent`](../type-aliases/SessionContent.md)\> = `any`

#### Returns

`T`

***

### set()

> **set**(`data`): `void`

#### Parameters

• **data**: `Record`\<`string`, `any`\>

#### Returns

`void`
