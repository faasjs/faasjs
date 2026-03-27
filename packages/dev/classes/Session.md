[@faasjs/dev](../README.md) / Session

# Class: Session\<S, C\>

## Type Parameters

### S

`S` _extends_ `Record`\<`string`, `string`\> = `any`

### C

`C` _extends_ `Record`\<`string`, `string`\> = `any`

## Constructors

### Constructor

> **new Session**\<`S`, `C`\>(`cookie`, `config`, `secrets?`): `Session`\<`S`, `C`\>

#### Parameters

##### cookie

[`Cookie`](Cookie.md)\<`C`, `S`\>

##### config

[`SessionOptions`](../type-aliases/SessionOptions.md) \| `SessionConfig`

##### secrets?

`SessionSecrets`

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

### fork()

> **fork**(`cookie`): `Session`\<`S`, `C`\>

#### Parameters

##### cookie

[`Cookie`](Cookie.md)\<`C`, `S`\>

#### Returns

`Session`\<`S`, `C`\>

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

`string` \| `number` \| `null`

#### Returns

`Session`\<`S`, `C`\>

## Properties

### config

> `readonly` **config**: `SessionConfig`

### content

> **content**: `Record`\<`string`, `string` \| `number`\>
