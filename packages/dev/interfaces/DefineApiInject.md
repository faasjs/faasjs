[@faasjs/dev](../README.md) / DefineApiInject

# Interface: DefineApiInject

API data augmentation map.

Extend this interface in plugin packages to describe which data fields are
injected into `defineApi` handler arguments.

## Extends

- `Record`\<`never`, `never`\>

## Properties

### body

> **body**: `any`

---

### headers

> **headers**: `Record`\<`string`, `any`\>

---

### setBody

> **setBody**: [`HttpSetBody`](../type-aliases/HttpSetBody.md)

---

### setContentType

> **setContentType**: [`HttpSetContentType`](../type-aliases/HttpSetContentType.md)

---

### setHeader

> **setHeader**: [`HttpSetHeader`](../type-aliases/HttpSetHeader.md)

---

### setStatusCode

> **setStatusCode**: [`HttpSetStatusCode`](../type-aliases/HttpSetStatusCode.md)
