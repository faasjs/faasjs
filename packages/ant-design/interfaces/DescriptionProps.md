[@faasjs/ant-design](../README.md) / DescriptionProps

# Interface: DescriptionProps\<T, ExtendItemProps\>

## Extends

- `Omit`\<`DescriptionsProps`, `"items"`\>

## Type Parameters

### T

`T` = `any`

### ExtendItemProps

`ExtendItemProps` = `any`

## Methods

### renderTitle()?

> `optional` **renderTitle**(`this`, `values`): `ReactNode`

#### Parameters

##### this

`void`

##### values

`T`

#### Returns

`ReactNode`

## Properties

### dataSource?

> `optional` **dataSource?**: `T`

### extendTypes?

> `optional` **extendTypes?**: `object`

#### Index Signature

\[`key`: `string`\]: [`ExtendDescriptionTypeProps`](ExtendDescriptionTypeProps.md)\<`any`\>

### faasData?

> `optional` **faasData?**: [`FaasDataWrapperProps`](FaasDataWrapperProps.md)\<`any`\>

### items

> **items**: (`ExtendItemProps` \| [`DescriptionItemProps`](DescriptionItemProps.md)\<`any`\>)[]
