[@faasjs/core](../README.md) / Session

# Class: Session\<S, C\>

## Type Parameters

### S

`S` *extends* `Record`\<`string`, `string`\> = `any`

### C

`C` *extends* `Record`\<`string`, `string`\> = `any`

## Constructors

### Constructor

> **new Session**\<`S`, `C`\>(`cookie`, `config`): `Session`\<`S`, `C`\>

#### Parameters

##### cookie

[`Cookie`](Cookie.md)\<`C`, `S`\>

##### config

[`SessionOptions`](../type-aliases/SessionOptions.md)

#### Returns

`Session`\<`S`, `C`\>

## Methods

### decode()

> **decode**\<`TData`\>(`text`): [`SessionContent`](../type-aliases/SessionContent.md) \| `TData`

#### Type Parameters

##### TData

`TData` = `any`

#### Parameters

##### text

`string`

#### Returns

[`SessionContent`](../type-aliases/SessionContent.md) \| `TData`

### encode()

> **encode**(`text`): `string`

#### Parameters

##### text

[`SessionContent`](../type-aliases/SessionContent.md)

#### Returns

`string`

### invoke()

> **invoke**(`cookie?`, `logger?`): `void`

#### Parameters

##### cookie?

`string`

##### logger?

`Logger`

#### Returns

`void`

### read()

> **read**(`key`): `string` \| `number`

#### Parameters

##### key

`string`

#### Returns

`string` \| `number`

### update()

> **update**(): `Session`\<`S`, `C`\>

#### Returns

`Session`\<`S`, `C`\>

### write()

> **write**(`key`, `value?`): `Session`\<`S`, `C`\>

#### Parameters

##### key

`string`

##### value?

`string` | `number` | `null`

#### Returns

`Session`\<`S`, `C`\>

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

### content

> **content**: `Record`\<`string`, `string` \| `number`\>
