[@faasjs/ant-design](../README.md) / ExtendTableTypeProps

# Type Alias: ExtendTableTypeProps\<T\>

> **ExtendTableTypeProps**\<`T`\> = `object`

Custom renderer registration for a table item type.

## Type Parameters

### T

`T` = `any`

Row record type rendered by the custom table item type.

## Properties

### children?

> `optional` **children?**: [`UnionFaasItemElement`](UnionFaasItemElement.md)\<`T`\>

Custom element used to render the registered table item type.

### render?

> `optional` **render?**: [`UnionFaasItemRender`](UnionFaasItemRender.md)\<`T`\>

Custom render callback used when `children` is not provided.
