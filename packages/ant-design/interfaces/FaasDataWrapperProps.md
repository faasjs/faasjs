[@faasjs/ant-design](../README.md) / FaasDataWrapperProps

# Interface: FaasDataWrapperProps\<T\>

## Extends

- `FaasDataWrapperProps`\<`T`\>

## Type Parameters

### T

`T` = `any`

## Methods

### onDataChange()?

> `optional` **onDataChange**(`args`): `void`

#### Parameters

##### args

`FaasDataInjection`\<`T`\>

#### Returns

`void`

#### Inherited from

`OriginProps.onDataChange`

### render()?

> `optional` **render**(`args`): `Element` \| `Element`[]

#### Parameters

##### args

`FaasDataInjection`\<`T`\>

#### Returns

`Element` \| `Element`[]

#### Inherited from

`OriginProps.render`

## Properties

### action

> **action**: `FaasAction`\<`T`\>

#### Inherited from

`OriginProps.action`

### baseUrl?

> `optional` **baseUrl**: `` `${string}/` ``

#### Inherited from

`OriginProps.baseUrl`

### children?

> `optional` **children**: `ReactElement`\<`Partial`\<`FaasDataInjection`\<`T`\>\>\>

#### Inherited from

`OriginProps.children`

### data?

> `optional` **data**: `FaasData`\<`T`\>

use custom data, should work with setData

#### Inherited from

`OriginProps.data`

### fallback?

> `optional` **fallback**: `false` \| `Element`

#### Inherited from

`OriginProps.fallback`

### loading?

> `optional` **loading**: `Element`

### loadingProps?

> `optional` **loadingProps**: [`LoadingProps`](../type-aliases/LoadingProps.md)

### params?

> `optional` **params**: `FaasParams`\<`T`\>

#### Inherited from

`OriginProps.params`

### ref?

> `optional` **ref**: `Ref`\<[`FaasDataWrapperRef`](../type-aliases/FaasDataWrapperRef.md)\<`T`\>\>

#### Inherited from

`OriginProps.ref`

### setData?

> `optional` **setData**: `Dispatch`\<`SetStateAction`\<`FaasData`\<`T`\>\>\>

use custom setData, should work with data

#### Inherited from

`OriginProps.setData`
