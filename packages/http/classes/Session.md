[@faasjs/http](../README.md) / Session

# Class: Session\<S, C\>

## Type parameters

• **S** extends `Record`\<`string`, `string`\> = `any`

• **C** extends `Record`\<`string`, `string`\> = `any`

## Constructors

### new Session(cookie, config)

> **new Session**\<`S`, `C`\>(`cookie`, `config`): [`Session`](Session.md)\<`S`, `C`\>

#### Parameters

• **cookie**: [`Cookie`](Cookie.md)\<`C`, `S`\>

• **config**: [`SessionOptions`](../type-aliases/SessionOptions.md)

#### Returns

[`Session`](Session.md)\<`S`, `C`\>

## Properties

### config

> **`readonly`** **config**: `Object`

#### Type declaration

##### cipherName

> **cipherName**: `string`

##### digest

> **digest**: `string`

##### iterations

> **iterations**: `number`

##### key

> **key**: `string`

##### keylen

> **keylen**: `number`

##### salt

> **salt**: `string`

##### secret

> **secret**: `string`

##### signedSalt

> **signedSalt**: `string`

### content

> **content**: `Record`\<`string`, `string` \| `number`\>

## Methods

### decode()

> **decode**\<`TData`\>(`text`): `SessionContent` \| `TData`

#### Type parameters

• **TData** = `any`

#### Parameters

• **text**: `string`

#### Returns

`SessionContent` \| `TData`

### encode()

> **encode**(`text`): `string`

#### Parameters

• **text**: `SessionContent`

#### Returns

`string`

### invoke()

> **invoke**(`cookie`?, `logger`?): `void`

#### Parameters

• **cookie?**: `string`

• **logger?**: `Logger`

#### Returns

`void`

### read()

> **read**(`key`): `string` \| `number`

#### Parameters

• **key**: `string`

#### Returns

`string` \| `number`

### update()

> **update**(): [`Session`](Session.md)\<`S`, `C`\>

#### Returns

[`Session`](Session.md)\<`S`, `C`\>

### write()

> **write**(`key`, `value`?): [`Session`](Session.md)\<`S`, `C`\>

#### Parameters

• **key**: `string`

• **value?**: `string` \| `number`

#### Returns

[`Session`](Session.md)\<`S`, `C`\>
