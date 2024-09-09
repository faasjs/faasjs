[@faasjs/ant-design](../README.md) / FaasDataWrapperProps

# Interface: FaasDataWrapperProps\<T\>

## Extends

- `FaasDataWrapperProps`\<`T`\>

## Type Parameters

• **T** = `any`

## Properties

### action

> **action**: `string`

#### Inherited from

`OriginProps.action`

### children?

> `optional` **children**: `ReactElement`\<`Partial`\<`FaasDataInjection`\<`any`\>\>, `string` \| `JSXElementConstructor`\<`any`\>\>

#### Inherited from

`OriginProps.children`

### data?

> `optional` **data**: `FaasData`\<`T`\>

use custom data, should work with setData

#### Inherited from

`OriginProps.data`

### domain?

> `optional` **domain**: `string`

#### Inherited from

`OriginProps.domain`

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

### setData?

> `optional` **setData**: `Dispatch`\<`SetStateAction`\<`FaasData`\<`T`\>\>\>

use custom setData, should work with data

#### Inherited from

`OriginProps.setData`

## Methods

### onDataChange()?

> `optional` **onDataChange**(`args`): `void`

#### Parameters

• **args**: `FaasDataInjection`\<`FaasData`\<`T`\>\>

#### Returns

`void`

#### Inherited from

`OriginProps.onDataChange`

### render()?

> `optional` **render**(`args`): `Element` \| `Element`[]

#### Parameters

• **args**: `FaasDataInjection`\<`FaasData`\<`T`\>\>

#### Returns

`Element` \| `Element`[]

#### Inherited from

`OriginProps.render`
