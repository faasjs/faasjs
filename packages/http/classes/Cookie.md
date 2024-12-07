[@faasjs/http](../README.md) / Cookie

# Class: Cookie\<C, S\>

## Type Parameters

• **C** *extends* `Record`\<`string`, `string`\> = `any`

• **S** *extends* `Record`\<`string`, `string`\> = `any`

## Constructors

### new Cookie()

> **new Cookie**\<`C`, `S`\>(`config`, `logger`?): [`Cookie`](Cookie.md)\<`C`, `S`\>

#### Parameters

##### config

[`CookieOptions`](../type-aliases/CookieOptions.md)

##### logger?

`Logger`

#### Returns

[`Cookie`](Cookie.md)\<`C`, `S`\>

## Methods

### headers()

> **headers**(): `object`

#### Returns

`object`

##### Set-Cookie?

> `optional` **Set-Cookie**: `string`[]

### invoke()

> **invoke**(`cookie`, `logger`): [`Cookie`](Cookie.md)\<`C`, `S`\>

#### Parameters

##### cookie

`string`

##### logger

`Logger`

#### Returns

[`Cookie`](Cookie.md)\<`C`, `S`\>

### read()

> **read**(`key`): `any`

#### Parameters

##### key

`string`

#### Returns

`any`

### write()

> **write**(`key`, `value`, `opts`?): [`Cookie`](Cookie.md)\<`C`, `S`\>

#### Parameters

##### key

`string`

##### value

`string`

##### opts?

###### domain

`string`

###### expires

`string` \| `number`

###### httpOnly

`boolean`

###### path

`string`

###### sameSite

`"Strict"` \| `"Lax"` \| `"None"`

###### secure

`boolean`

#### Returns

[`Cookie`](Cookie.md)\<`C`, `S`\>

## Properties

### config

> `readonly` **config**: `object`

#### domain?

> `optional` **domain**: `string`

#### expires

> **expires**: `number`

#### httpOnly

> **httpOnly**: `boolean`

#### path

> **path**: `string`

#### sameSite?

> `optional` **sameSite**: `"Strict"` \| `"Lax"` \| `"None"`

#### secure

> **secure**: `boolean`

#### session

> **session**: [`SessionOptions`](../type-aliases/SessionOptions.md)

### content

> **content**: `Record`\<`string`, `string`\>

### logger

> **logger**: `Logger`

### session

> **session**: [`Session`](Session.md)\<`S`, `C`\>
