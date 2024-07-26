[@faasjs/test](../README.md) / Plugin

# Type Alias: Plugin

> **Plugin**: `object`

## Index Signature

 \[`key`: `string`\]: `any`

## Type declaration

### name

> `readonly` **name**: `string`

### onDeploy()?

> `optional` **onDeploy**: (`data`, `next`) => `Promise`\<`void`\>

#### Parameters

• **data**: [`DeployData`](DeployData.md)

• **next**: [`Next`](Next.md)

#### Returns

`Promise`\<`void`\>

### onInvoke()?

> `optional` **onInvoke**: (`data`, `next`) => `Promise`\<`void`\>

#### Parameters

• **data**: [`InvokeData`](InvokeData.md)

• **next**: [`Next`](Next.md)

#### Returns

`Promise`\<`void`\>

### onMount()?

> `optional` **onMount**: (`data`, `next`) => `Promise`\<`void`\>

#### Parameters

• **data**: [`MountData`](MountData.md)

• **next**: [`Next`](Next.md)

#### Returns

`Promise`\<`void`\>

### type

> `readonly` **type**: `string`
