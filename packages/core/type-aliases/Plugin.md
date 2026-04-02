[@faasjs/core](../README.md) / Plugin

# Type Alias: Plugin

> **Plugin** = `object`

Lifecycle plugin attached to a [Func](../classes/Func.md).

## Indexable

> \[`key`: `string`\]: `any`

## Properties

### name

> `readonly` **name**: `string`

Instance name used for ordering and logs.

---

### onInvoke?

> `optional` **onInvoke?**: (`data`, `next`) => `Promise`\<`void`\>

Optional hook that runs for every invocation.

#### Parameters

##### data

[`InvokeData`](InvokeData.md)

##### next

[`Next`](Next.md)

#### Returns

`Promise`\<`void`\>

---

### onMount?

> `optional` **onMount?**: (`data`, `next`) => `Promise`\<`void`\>

Optional hook that runs once before the first invoke.

#### Parameters

##### data

[`MountData`](MountData.md)

##### next

[`Next`](Next.md)

#### Returns

`Promise`\<`void`\>

---

### type

> `readonly` **type**: `string`

Stable plugin type identifier.
