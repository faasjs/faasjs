[@faasjs/core](../README.md) / Session

# Class: Session\<S, C\>

Encrypted session storage backed by a signed cookie.

## Example

```ts
import { Cookie } from '@faasjs/core'

const cookie = new Cookie({
  secure: false,
  session: {
    key: 'session_id',
    secret: 'replace-me',
  },
})

cookie.session.write('userId', '1').update()
cookie.headers()
```

## Type Parameters

### S

`S` _extends_ `Record`\<`string`, `string`\> = `any`

Session value map exposed by `read()` and `content`.

### C

`C` _extends_ `Record`\<`string`, `string`\> = `any`

Cookie value map exposed by the parent cookie store.

## Constructors

### Constructor

> **new Session**\<`S`, `C`\>(`cookie`, `config`, `secrets?`): `Session`\<`S`, `C`\>

Create a session helper bound to a cookie store.

#### Parameters

##### cookie

[`Cookie`](Cookie.md)\<`C`, `S`\>

Parent cookie store used for persistence.

##### config

[`SessionOptions`](../type-aliases/SessionOptions.md) \| `SessionConfig`

Session encryption and cookie key options.

[`SessionOptions`](../type-aliases/SessionOptions.md)

---

`SessionConfig`

##### secrets?

`SessionSecrets`

Precomputed secrets reused by forked sessions.

#### Returns

`Session`\<`S`, `C`\>

## Methods

### decode()

> **decode**\<`TData`\>(`text`): [`SessionContent`](../type-aliases/SessionContent.md) \| `TData`

Decode and verify a session cookie value.

#### Type Parameters

##### TData

`TData` = `any`

Expected decoded payload shape.

#### Parameters

##### text

`string`

Encoded cookie value.

#### Returns

[`SessionContent`](../type-aliases/SessionContent.md) \| `TData`

Decoded session payload.

#### Throws

When the signature is invalid or the payload cannot be decrypted.

---

### encode()

> **encode**(`text`): `string`

Serialize session content into a signed, encrypted cookie string.

Non-string payloads are JSON serialized before encryption.

#### Parameters

##### text

[`SessionContent`](../type-aliases/SessionContent.md)

Session payload to encode.

#### Returns

`string`

Encoded cookie value.

---

### fork()

> **fork**(`cookie`): `Session`\<`S`, `C`\>

Clone the session helper for a forked cookie store.

#### Parameters

##### cookie

[`Cookie`](Cookie.md)\<`C`, `S`\>

Forked cookie store.

#### Returns

`Session`\<`S`, `C`\>

Session helper sharing the same derived secrets.

---

### invoke()

> **invoke**(`cookie?`, `logger?`): `void`

Decode the current session cookie into memory.

#### Parameters

##### cookie?

`string`

Encoded session cookie value.

##### logger?

`Logger`

Optional logger for decode failures.

#### Returns

`void`

No return value.

---

### read()

> **read**(`key`): `string` \| `number`

Read a session value by key.

#### Parameters

##### key

`string`

Session key.

#### Returns

`string` \| `number`

Stored session value.

---

### update()

> **update**(): `Session`\<`S`, `C`\>

Persist pending in-memory changes back to the session cookie.

#### Returns

`Session`\<`S`, `C`\>

Current session helper for chaining.

---

### write()

> **write**(`key`, `value?`): `Session`\<`S`, `C`\>

Set or remove a session value in memory.

#### Parameters

##### key

`string`

Session key.

##### value?

`string` \| `number` \| `null`

Session value, or `null`/`undefined` to delete it.

#### Returns

`Session`\<`S`, `C`\>

Current session helper for chaining.

## Properties

### config

> `readonly` **config**: `SessionConfig`

Normalized session config with derived defaults.

---

### content

> **content**: `Record`\<`string`, `string` \| `number`\>

Decoded session values for the current request.
