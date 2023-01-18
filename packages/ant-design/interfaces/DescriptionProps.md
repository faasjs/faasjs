# Interface: DescriptionProps<T, ExtendItemProps\>

## Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |
| `ExtendItemProps` | `any` |

## Hierarchy

- `DescriptionsProps`

  ↳ **`DescriptionProps`**

## Table of contents

### Properties

- [dataSource](DescriptionProps.md#datasource)
- [extendTypes](DescriptionProps.md#extendtypes)
- [faasData](DescriptionProps.md#faasdata)
- [items](DescriptionProps.md#items)
- [renderTitle](DescriptionProps.md#rendertitle)

## Properties

### dataSource

• `Optional` **dataSource**: `T`

___

### extendTypes

• `Optional` **extendTypes**: `Object`

#### Index signature

▪ [key: `string`]: [`ExtendDescriptionTypeProps`](ExtendDescriptionTypeProps.md)

___

### faasData

• `Optional` **faasData**: [`FaasDataWrapperProps`](../modules.md#faasdatawrapperprops)<`T`\>

___

### items

• **items**: (`ExtendItemProps` \| [`DescriptionItemProps`](DescriptionItemProps.md)<`any`\>)[]

___

### renderTitle

• `Optional` **renderTitle**: (`values`: `T`) => `ReactNode`

#### Type declaration

▸ (`values`): `ReactNode`

##### Parameters

| Name | Type |
| :------ | :------ |
| `values` | `T` |

##### Returns

`ReactNode`
