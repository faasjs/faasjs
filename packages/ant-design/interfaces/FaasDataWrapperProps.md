[@faasjs/ant-design](../README.md) / FaasDataWrapperProps

# Interface: FaasDataWrapperProps\<T\>

## Extends

- `FaasDataWrapperProps`\<`T`\>

## Type parameters

• **T** = `any`

## Properties

### action

> **action**: `string`

#### Inherited from

`OriginProps.action`

### children?

> **children**?: `ReactElement`\<`Partial`\<`FaasDataInjection`\<`any`\>\>, `string` \| `JSXElementConstructor`\<`any`\>\>

#### Inherited from

`OriginProps.children`

### data?

> **data**?: `FaasData`\<`PathOrData`\>

use custom data, should work with setData

#### Inherited from

`OriginProps.data`

### fallback?

> **fallback**?: `false` \| `Element`

#### Inherited from

`OriginProps.fallback`

### loading?

> **loading**?: `Element`

### loadingProps?

> **loadingProps**?: [`LoadingProps`](../type-aliases/LoadingProps.md)

### params?

> **params**?: `FaasParams`\<`PathOrData`\>

#### Inherited from

`OriginProps.params`

### setData?

> **setData**?: `Dispatch`\<`any`\>

use custom setData, should work with data

#### Inherited from

`OriginProps.setData`

## Methods

### onDataChange()?

> **`optional`** **onDataChange**(`args`): `void`

#### Parameters

• **args**: `FaasDataInjection`\<`FaasData`\<`PathOrData`\>\>

#### Returns

`void`

#### Inherited from

`OriginProps.onDataChange`

### render()?

> **`optional`** **render**(`args`): `Element` \| `Element`[]

#### Parameters

• **args**: `FaasDataInjection`\<`FaasData`\<`PathOrData`\>\>

#### Returns

`Element` \| `Element`[]

#### Inherited from

`OriginProps.render`
