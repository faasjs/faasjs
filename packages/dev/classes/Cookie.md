[@faasjs/dev](../README.md) / Cookie

# Class: Cookie\<C, S\>

## Type Parameters

### C

`C` _extends_ `Record`\<`string`, `string`\> = `any`

### S

`S` _extends_ `Record`\<`string`, `string`\> = `any`

## Constructors

### Constructor

> **new Cookie**\<`C`, `S`\>(`config`, `logger?`, `options?`): `Cookie`\<`C`, `S`\>

#### Parameters

##### config

[`CookieOptions`](../type-aliases/CookieOptions.md)

##### logger?

`Logger`

##### options?

###### template?

`Cookie`\<`C`, `S`\>

#### Returns

`Cookie`\<`C`, `S`\>

## Methods

### fork()

> **fork**(`logger?`): `Cookie`\<`C`, `S`\>

#### Parameters

##### logger?

`Logger`

#### Returns

`Cookie`\<`C`, `S`\>

### headers()

> **headers**(): `object`

#### Returns

`object`

##### Set-Cookie?

> `optional` **Set-Cookie?**: `string`[]

### invoke()

> **invoke**(`cookie`, `logger`): `Cookie`\<`C`, `S`\>

#### Parameters

##### cookie

`string` \| `undefined`

##### logger

`Logger`

#### Returns

`Cookie`\<`C`, `S`\>

### read()

> **read**(`key`): `any`

#### Parameters

##### key

`string`

#### Returns

`any`

### write()

> **write**(`key`, `value`, `opts?`): `Cookie`\<`C`, `S`\>

#### Parameters

##### key

`string`

##### value

`string` \| `null` \| `undefined`

##### opts?

###### domain?

`string`

###### expires?

`string` \| `number`

###### httpOnly?

`boolean`

###### path?

`string`

###### sameSite?

`"Strict"` \| `"Lax"` \| `"None"`

###### secure?

`boolean`

#### Returns

`Cookie`\<`C`, `S`\>

## Properties

### config

> `readonly` **config**: `CookieConfig`

### content

> **content**: `Record`\<`string`, `string`\>

### logger

> **logger**: `Logger` \| `undefined`

### session

> **session**: [`Session`](Session.md)\<`S`, `C`\>
