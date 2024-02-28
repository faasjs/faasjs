[@faasjs/ant-design](../README.md) / DescriptionProps

# Interface: DescriptionProps\<T, ExtendItemProps\>

## Extends

- `Omit`\<`DescriptionsProps`, `"items"`\>

## Type parameters

• **T** = `any`

• **ExtendItemProps** = `any`

## Properties

### dataSource?

> **`optional`** **dataSource**: `T`

### extendTypes?

> **`optional`** **extendTypes**: `Object`

#### Index signature

 \[`key`: `string`\]: [`ExtendDescriptionTypeProps`](ExtendDescriptionTypeProps.md)

### faasData?

> **`optional`** **faasData**: [`FaasDataWrapperProps`](FaasDataWrapperProps.md)\<`T`\>

### items

> **items**: (`ExtendItemProps` \| [`DescriptionItemProps`](DescriptionItemProps.md)\<`any`\>)[]

## Methods

### renderTitle()?

> **`optional`** **renderTitle**(`values`): `ReactNode`

#### Parameters

• **values**: `T`

#### Returns

`ReactNode`
