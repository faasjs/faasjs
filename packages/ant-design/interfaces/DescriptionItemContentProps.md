[@faasjs/ant-design](../README.md) / DescriptionItemContentProps

# Interface: DescriptionItemContentProps\<T\>

Props passed to the DescriptionItemContent internal renderer.

## Type Parameters

### T

`T` = `any`

Data record shape rendered by the description list.

## Properties

### extendTypes?

> `optional` **extendTypes?**: `object`

Custom type renderers keyed by item type.

#### Index Signature

\[`key`: `string`\]: [`ExtendDescriptionTypeProps`](../type-aliases/ExtendDescriptionTypeProps.md)\<`any`\>

### item

> **item**: [`DescriptionItemProps`](DescriptionItemProps.md)

The item definition being rendered.

### value

> **value**: `T`

Raw value read from the data source for this item's `id`.

### values?

> `optional` **values?**: `any`

Entire data source record (optional).
