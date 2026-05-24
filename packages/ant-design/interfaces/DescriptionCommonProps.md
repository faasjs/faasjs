[@faasjs/ant-design](../README.md) / DescriptionCommonProps

# Interface: DescriptionCommonProps\<T, ExtendItemProps\>

## Extends

- `Omit`\<`DescriptionsProps`, `"items"`\>

## Extended by

- [`DescriptionWithFaasProps`](DescriptionWithFaasProps.md)
- [`DescriptionWithoutFaasProps`](DescriptionWithoutFaasProps.md)

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

### extendTypes?

> `optional` **extendTypes?**: `object`

#### Index Signature

\[`key`: `string`\]: [`ExtendDescriptionTypeProps`](../type-aliases/ExtendDescriptionTypeProps.md)\<`any`\>

### items

> **items**: (`ExtendItemProps` \| [`DescriptionItemProps`](DescriptionItemProps.md)\<`any`\>)[]
