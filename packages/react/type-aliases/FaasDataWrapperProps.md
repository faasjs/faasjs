[@faasjs/react](../README.md) / FaasDataWrapperProps

# Type Alias: FaasDataWrapperProps\<PathOrData\>

> **FaasDataWrapperProps**\<`PathOrData`\> = `object`

## Type Parameters

### PathOrData

`PathOrData` *extends* [`FaasActionUnionType`](FaasActionUnionType.md)

## Methods

### onDataChange()?

> `optional` **onDataChange**(`args`): `void`

#### Parameters

##### args

[`FaasDataInjection`](FaasDataInjection.md)\<`PathOrData`\>

#### Returns

`void`

### render()?

> `optional` **render**(`args`): `Element` \| `Element`[]

#### Parameters

##### args

[`FaasDataInjection`](FaasDataInjection.md)\<`PathOrData`\>

#### Returns

`Element` \| `Element`[]

## Properties

### action

> **action**: [`FaasAction`](FaasAction.md)\<`PathOrData`\>

### baseUrl?

> `optional` **baseUrl**: [`BaseUrl`](BaseUrl.md)

### children?

> `optional` **children**: `React.ReactElement`\<`Partial`\<[`FaasDataInjection`](FaasDataInjection.md)\<`PathOrData`\>\>\>

### data?

> `optional` **data**: [`FaasData`](FaasData.md)\<`PathOrData`\>

use custom data, should work with setData

### fallback?

> `optional` **fallback**: `JSX.Element` \| `false`

### params?

> `optional` **params**: [`FaasParams`](FaasParams.md)\<`PathOrData`\>

### ref?

> `optional` **ref**: `React.Ref`\<[`FaasDataWrapperRef`](FaasDataWrapperRef.md)\<`PathOrData`\>\>

### setData?

> `optional` **setData**: `React.Dispatch`\<`React.SetStateAction`\<[`FaasData`](FaasData.md)\<`PathOrData`\>\>\>

use custom setData, should work with data
