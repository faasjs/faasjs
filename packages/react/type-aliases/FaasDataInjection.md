[@faasjs/react](../README.md) / FaasDataInjection

# Type Alias: FaasDataInjection\<Data\>

> **FaasDataInjection**\<`Data`\>: `object`

Injects FaasData props.

## Type Parameters

• **Data** = `any`

## Type declaration

### action

> **action**: `string` \| `any`

### data

> **data**: `Data`

### error

> **error**: `any`

### loading

> **loading**: `boolean`

### params

> **params**: `Record`\<`string`, `any`\>

### promise

> **promise**: `Promise`\<`Response`\<`Data`\>\>

### reloadTimes

> **reloadTimes**: `number`

### setData

> **setData**: `React.Dispatch`\<`React.SetStateAction`\<`Data`\>\>

### setError

> **setError**: `React.Dispatch`\<`React.SetStateAction`\<`any`\>\>

### setLoading

> **setLoading**: `React.Dispatch`\<`React.SetStateAction`\<`boolean`\>\>

### setPromise

> **setPromise**: `React.Dispatch`\<`React.SetStateAction`\<`Promise`\<`Response`\<`Data`\>\>\>\>

### reload()

#### Parameters

• **params?**: `Record`\<`string`, `any`\>

#### Returns

`Promise`\<`any`\>
