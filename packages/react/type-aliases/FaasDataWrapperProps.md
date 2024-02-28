[@faasjs/react](../README.md) / FaasDataWrapperProps

# Type alias: FaasDataWrapperProps\<PathOrData\>

> **FaasDataWrapperProps**\<`PathOrData`\>: `Object`

## Type parameters

• **PathOrData** extends `FaasAction`

## Type declaration

### action

> **action**: `string`

### children?

> **`optional`** **children**: `React.ReactElement`\<`Partial`\<[`FaasDataInjection`](FaasDataInjection.md)\>\>

### data?

> **`optional`** **data**: `FaasData`\<`PathOrData`\>

use custom data, should work with setData

### fallback?

> **`optional`** **fallback**: `JSX.Element` \| `false`

### params?

> **`optional`** **params**: `FaasParams`\<`PathOrData`\>

### setData?

> **`optional`** **setData**: `React.Dispatch`\<`React.SetStateAction`\<`FaasData`\<`PathOrData`\>\>\>

use custom setData, should work with data

### onDataChange()?

#### Parameters

• **args**: [`FaasDataInjection`](FaasDataInjection.md)\<`FaasData`\<`PathOrData`\>\>

#### Returns

`void`

### render()?

#### Parameters

• **args**: [`FaasDataInjection`](FaasDataInjection.md)\<`FaasData`\<`PathOrData`\>\>

#### Returns

`Element` \| `Element`[]
