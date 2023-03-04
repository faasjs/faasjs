# Interface: FaasDataWrapperProps<PathOrData\>

## Type parameters

| Name | Type |
| :------ | :------ |
| `PathOrData` | extends [`FaasAction`](../modules.md#faasaction) |

## Table of contents

### Properties

- [action](FaasDataWrapperProps.md#action)
- [children](FaasDataWrapperProps.md#children)
- [data](FaasDataWrapperProps.md#data)
- [fallback](FaasDataWrapperProps.md#fallback)
- [params](FaasDataWrapperProps.md#params)
- [setData](FaasDataWrapperProps.md#setdata)

### Methods

- [onDataChange](FaasDataWrapperProps.md#ondatachange)
- [render](FaasDataWrapperProps.md#render)

## Properties

### action

• **action**: `string`

___

### children

• `Optional` **children**: `ReactElement`<`Partial`<[`FaasDataInjection`](FaasDataInjection.md)<`any`\>\>, `string` \| `JSXElementConstructor`<`any`\>\>

___

### data

• `Optional` **data**: [`FaasData`](../modules.md#faasdata)<`PathOrData`\>

use custom data, should work with setData

___

### fallback

• `Optional` **fallback**: ``false`` \| `Element`

___

### params

• `Optional` **params**: [`FaasParams`](../modules.md#faasparams)<`PathOrData`\>

___

### setData

• `Optional` **setData**: `Dispatch`<`SetStateAction`<[`FaasData`](../modules.md#faasdata)<`PathOrData`\>\>\>

use custom setData, should work with data

## Methods

### onDataChange

▸ `Optional` **onDataChange**(`args`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `args` | [`FaasDataInjection`](FaasDataInjection.md)<[`FaasData`](../modules.md#faasdata)<`PathOrData`\>\> |

#### Returns

`void`

___

### render

▸ `Optional` **render**(`args`): `Element` \| `Element`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `args` | [`FaasDataInjection`](FaasDataInjection.md)<[`FaasData`](../modules.md#faasdata)<`PathOrData`\>\> |

#### Returns

`Element` \| `Element`[]
