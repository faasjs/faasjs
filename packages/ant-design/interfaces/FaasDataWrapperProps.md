# Interface: FaasDataWrapperProps<T\>

## Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |

## Hierarchy

- `FaasDataWrapperProps`<`T`\>

  ↳ **`FaasDataWrapperProps`**

## Table of contents

### Properties

- [action](FaasDataWrapperProps.md#action)
- [children](FaasDataWrapperProps.md#children)
- [data](FaasDataWrapperProps.md#data)
- [fallback](FaasDataWrapperProps.md#fallback)
- [loading](FaasDataWrapperProps.md#loading)
- [loadingProps](FaasDataWrapperProps.md#loadingprops)
- [params](FaasDataWrapperProps.md#params)
- [setData](FaasDataWrapperProps.md#setdata)

### Methods

- [onDataChange](FaasDataWrapperProps.md#ondatachange)
- [render](FaasDataWrapperProps.md#render)

## Properties

### action

• **action**: `string`

#### Inherited from

OriginProps.action

___

### children

• `Optional` **children**: `Element`

#### Inherited from

OriginProps.children

___

### data

• `Optional` **data**: `FaasData`<`T`\>

use custom data, should work with setData

#### Inherited from

OriginProps.data

___

### fallback

• `Optional` **fallback**: ``false`` \| `Element`

#### Inherited from

OriginProps.fallback

___

### loading

• `Optional` **loading**: `Element`

___

### loadingProps

• `Optional` **loadingProps**: [`LoadingProps`](../modules.md#loadingprops)

___

### params

• `Optional` **params**: `FaasParams`<`T`\>

#### Inherited from

OriginProps.params

___

### setData

• `Optional` **setData**: `Dispatch`<`SetStateAction`<`FaasData`<`T`\>\>\>

use custom setData, should work with data

#### Inherited from

OriginProps.setData

## Methods

### onDataChange

▸ `Optional` **onDataChange**(`args`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `args` | [`FaasDataInjection`](FaasDataInjection.md)<`FaasData`<`T`\>\> |

#### Returns

`void`

#### Inherited from

OriginProps.onDataChange

___

### render

▸ `Optional` **render**(`args`): `Element` \| `Element`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `args` | [`FaasDataInjection`](FaasDataInjection.md)<`FaasData`<`T`\>\> |

#### Returns

`Element` \| `Element`[]

#### Inherited from

OriginProps.render
