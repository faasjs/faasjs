# Interface: DescriptionProps\<T, ExtendItemProps\>

## Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |
| `ExtendItemProps` | `any` |

## Hierarchy

- `Omit`\<`DescriptionsProps`, ``"items"``\>

  ↳ **`DescriptionProps`**

## Table of contents

### Properties

- [dataSource](DescriptionProps.md#datasource)
- [extendTypes](DescriptionProps.md#extendtypes)
- [faasData](DescriptionProps.md#faasdata)
- [items](DescriptionProps.md#items)

### Methods

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

• `Optional` **faasData**: [`FaasDataWrapperProps`](FaasDataWrapperProps.md)\<`T`\>

___

### items

• **items**: (`ExtendItemProps` \| [`DescriptionItemProps`](DescriptionItemProps.md)\<`any`\>)[]

## Methods

### renderTitle

▸ **renderTitle**(`values`): `ReactNode`

#### Parameters

| Name | Type |
| :------ | :------ |
| `values` | `T` |

#### Returns

`ReactNode`
