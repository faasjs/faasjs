[**@faasjs/ant-design**](../README.md)

[@faasjs/ant-design](../README.md) / DescriptionCommonProps

# Interface: DescriptionCommonProps\<T, ExtendItemProps\>

Shared props used by both local-data and Faas-data description lists.

## Extends

- `Omit`\<`DescriptionsProps`, `"items"`\>

## Extended by

- [`DescriptionWithFaasProps`](DescriptionWithFaasProps.md)
- [`DescriptionWithoutFaasProps`](DescriptionWithoutFaasProps.md)

## Type Parameters

### T

`T` = `any`

Data record shape rendered by the description list.

### ExtendItemProps

`ExtendItemProps` = `any`

Additional item prop shape accepted by `items`.

## Methods

### renderTitle()?

> `optional` **renderTitle**(`this`, `values`): `ReactNode`

Callback that returns a custom React node for the title.

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

Custom type renderers keyed by item type.

#### Index Signature

\[`key`: `string`\]: [`ExtendDescriptionTypeProps`](../type-aliases/ExtendDescriptionTypeProps.md)\<`any`\>

### items

> **items**: (`ExtendItemProps` \| [`DescriptionItemProps`](DescriptionItemProps.md)\<`any`>>>>>>\>)[]

Item metadata definitions rendered as description entries.
