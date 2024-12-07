[@faasjs/test](../README.md) / Plugin

# Type Alias: Plugin

> **Plugin**: `object`

## Type declaration

## Index Signature

 \[`key`: `string`\]: `any`

### name

> `readonly` **name**: `string`

### onInvoke()?

> `optional` **onInvoke**: (`data`, `next`) => `Promise`\<`void`\>

#### Parameters

##### data

[`InvokeData`](InvokeData.md)

##### next

[`Next`](Next.md)

#### Returns

`Promise`\<`void`\>

### onMount()?

> `optional` **onMount**: (`data`, `next`) => `Promise`\<`void`\>

#### Parameters

##### data

[`MountData`](MountData.md)

##### next

[`Next`](Next.md)

#### Returns

`Promise`\<`void`\>

### type

> `readonly` **type**: `string`
