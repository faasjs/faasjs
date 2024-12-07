[@faasjs/react](../README.md) / FaasDataInjection

# Type Alias: FaasDataInjection\<PathOrData\>

> **FaasDataInjection**\<`PathOrData`\>: `object`

Injects FaasData props.

## Type Parameters

• **PathOrData** *extends* [`FaasAction`](FaasAction.md) = `any`

## Type declaration

### action

> **action**: `PathOrData` \| `string`

### data

> **data**: [`FaasData`](FaasData.md)\<`PathOrData`\>

### error

> **error**: `any`

### loading

> **loading**: `boolean`

### params

> **params**: `Record`\<`string`, `any`\>

### promise

> **promise**: `Promise`\<[`Response`](../classes/Response.md)\<[`FaasData`](FaasData.md)\<`PathOrData`\>\>\>

### reloadTimes

> **reloadTimes**: `number`

### setData

> **setData**: `React.Dispatch`\<`React.SetStateAction`\<[`FaasData`](FaasData.md)\<`PathOrData`\>\>\>

### setError

> **setError**: `React.Dispatch`\<`React.SetStateAction`\<`any`\>\>

### setLoading

> **setLoading**: `React.Dispatch`\<`React.SetStateAction`\<`boolean`\>\>

### setPromise

> **setPromise**: `React.Dispatch`\<`React.SetStateAction`\<`Promise`\<[`Response`](../classes/Response.md)\<[`FaasData`](FaasData.md)\<`PathOrData`\>\>\>\>\>

### reload()

Reloads data with new or existing parameters.

**Note**: It will sets skip to false before loading data.

#### Parameters

##### params?

`Record`\<`string`, `any`\>

#### Returns

`Promise`\<[`Response`](../classes/Response.md)\<`PathOrData`\>\>
