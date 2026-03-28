[@faasjs/ant-design](../README.md) / DescriptionProps

# Interface: DescriptionProps\<T, ExtendItemProps\>

Props for the [Description](../functions/Description.md) component.

## Extends

- `Omit`\<`DescriptionsProps`, `"items"`\>

## Type Parameters

### T

`T` = `any`

Data record shape rendered by the component.

### ExtendItemProps

`ExtendItemProps` = `any`

Additional item prop shape accepted by `items`.

## Methods

### renderTitle()?

> `optional` **renderTitle**(`this`, `values`): `ReactNode`

Callback used to derive the rendered title from the current record.

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

Local data record rendered directly by the component.

### extendTypes?

> `optional` **extendTypes?**: `object`

Custom type renderers keyed by item type.

#### Index Signature

\[`key`: `string`\]: [`ExtendDescriptionTypeProps`](ExtendDescriptionTypeProps.md)\<`any`\>

### faasData?

> `optional` **faasData?**: [`FaasDataWrapperProps`](FaasDataWrapperProps.md)\<`any`\>

Request config used to fetch the record before rendering.

### items

> **items**: (`ExtendItemProps` \| [`DescriptionItemProps`](DescriptionItemProps.md)\<`any`\>)[]

Description item definitions rendered by the component.
