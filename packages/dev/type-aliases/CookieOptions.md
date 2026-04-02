[@faasjs/dev](../README.md) / CookieOptions

# Type Alias: CookieOptions

> **CookieOptions** = `object`

Cookie defaults and session integration options used by [Cookie](../classes/Cookie.md).

## Indexable

> \[`key`: `string`\]: `any`

## Properties

### domain?

> `optional` **domain?**: `string`

Cookie domain attribute.

---

### expires?

> `optional` **expires?**: `number`

Max age in seconds for persisted cookies.

#### Default

```ts
31536000
```

---

### httpOnly?

> `optional` **httpOnly?**: `boolean`

Whether cookies are hidden from client-side scripts.

#### Default

```ts
true
```

---

### path?

> `optional` **path?**: `string`

Cookie path attribute.

#### Default

```ts
'/'
```

---

### sameSite?

> `optional` **sameSite?**: `"Strict"` \| `"Lax"` \| `"None"`

SameSite attribute applied to written cookies.

---

### secure?

> `optional` **secure?**: `boolean`

Whether cookies require HTTPS transport.

#### Default

```ts
true
```

---

### session?

> `optional` **session?**: [`SessionOptions`](SessionOptions.md)

Session encryption and signing settings.
