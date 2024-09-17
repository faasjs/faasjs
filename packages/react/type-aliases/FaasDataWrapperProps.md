[@faasjs/react](../README.md) / FaasDataWrapperProps

# Type Alias: FaasDataWrapperProps\<PathOrData\>

> **FaasDataWrapperProps**\<`PathOrData`\>: `object`

## Type Parameters

• **PathOrData** *extends* [`FaasAction`](FaasAction.md)

## Type declaration

### action

> **action**: `PathOrData` \| `string`

### baseUrl?

> `optional` **baseUrl**: `BaseUrl`

### children?

> `optional` **children**: `React.ReactElement`\<`Partial`\<[`FaasDataInjection`](FaasDataInjection.md)\<`PathOrData`\>\>\>

### data?

> `optional` **data**: [`FaasData`](FaasData.md)\<`PathOrData`\>

use custom data, should work with setData

### fallback?

> `optional` **fallback**: `JSX.Element` \| `false`

### params?

> `optional` **params**: [`FaasParams`](FaasParams.md)\<`PathOrData`\>

### setData?

> `optional` **setData**: `React.Dispatch`\<`React.SetStateAction`\<[`FaasData`](FaasData.md)\<`PathOrData`\>\>\>

use custom setData, should work with data

### onDataChange()?

#### Parameters

• **args**: [`FaasDataInjection`](FaasDataInjection.md)\<`PathOrData`\>

#### Returns

`void`

### render()?

#### Parameters

• **args**: [`FaasDataInjection`](FaasDataInjection.md)\<`PathOrData`\>

#### Returns

`Element` \| `Element`[]
