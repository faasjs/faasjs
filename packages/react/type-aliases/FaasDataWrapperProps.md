[@faasjs/react](../README.md) / FaasDataWrapperProps

# Type alias: FaasDataWrapperProps\<PathOrData\>

> **FaasDataWrapperProps**\<`PathOrData`\>: `Object`

## Type parameters

• **PathOrData** extends `FaasAction`

## Type declaration

### action

> **action**: `string`

### children?

> **children**?: `React.ReactElement`\<`Partial`\<[`FaasDataInjection`](FaasDataInjection.md)\>\>

### data?

> **data**?: `FaasData`\<`PathOrData`\>

use custom data, should work with setData

### fallback?

> **fallback**?: `JSX.Element` \| `false`

### params?

> **params**?: `FaasParams`\<`PathOrData`\>

### setData?

> **setData**?: `React.Dispatch`\<`React.SetStateAction`\<`FaasData`\<`PathOrData`\>\>\>

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
