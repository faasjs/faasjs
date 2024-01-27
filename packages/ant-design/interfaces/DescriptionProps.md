[@faasjs/ant-design](../README.md) / DescriptionProps

# Interface: DescriptionProps\<T, ExtendItemProps\>

## Extends

- `Omit`\<`DescriptionsProps`, `"items"`\>

## Type parameters

• **T** = `any`

• **ExtendItemProps** = `any`

## Properties

### dataSource?

> **dataSource**?: `T`

### extendTypes?

> **extendTypes**?: `Object`

#### Index signature

 \[`key`: `string`\]: [`ExtendDescriptionTypeProps`](ExtendDescriptionTypeProps.md)

### faasData?

> **faasData**?: [`FaasDataWrapperProps`](FaasDataWrapperProps.md)\<`T`\>

### items

> **items**: (`ExtendItemProps` \| [`DescriptionItemProps`](DescriptionItemProps.md)\<`any`\>)[]

## Methods

### renderTitle()?

> **`optional`** **renderTitle**(`values`): `ReactNode`

#### Parameters

• **values**: `T`

#### Returns

`ReactNode`
