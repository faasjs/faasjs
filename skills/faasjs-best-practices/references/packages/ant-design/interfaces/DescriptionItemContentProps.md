[@faasjs/ant-design](../README.md) / DescriptionItemContentProps

# Interface: DescriptionItemContentProps\<T\>

Props passed to the exported `DescriptionItemContent` helper shape.

## Type Parameters

### T

`T` = `any`

Value type rendered by the item content.

## Properties

### extendTypes?

> `optional` **extendTypes?**: `object`

Custom type renderers keyed by item type.

#### Index Signature

\[`key`: `string`\]: [`ExtendDescriptionTypeProps`](ExtendDescriptionTypeProps.md)\<`any`\>

### item

> **item**: [`DescriptionItemProps`](DescriptionItemProps.md)

Item definition describing how the value should render.

### value

> **value**: `T`

Current item value.

### values?

> `optional` **values?**: `any`

Full record containing the current value.
