[**@faasjs/ant-design**](../README.md)

[@faasjs/ant-design](../README.md) / DescriptionWithoutFaasProps

# Interface: DescriptionWithoutFaasProps\<T, ExtendItemProps\>

Props for the [Description](../functions/Description.md) component when rendering a local data source.

## Extends

- [`DescriptionCommonProps`](DescriptionCommonProps.md)\<`T`, `ExtendItemProps`\>

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

#### Inherited from

[`DescriptionCommonProps`](DescriptionCommonProps.md).[`renderTitle`](DescriptionCommonProps.md#rendertitle)

## Properties

### dataSource?

> `optional` **dataSource?**: `T`

Local data source rendered by the description list.

### extendTypes?

> `optional` **extendTypes?**: `object`

Custom type renderers keyed by item type.

#### Index Signature

\[`key`: `string`\]: [`ExtendDescriptionTypeProps`](../type-aliases/ExtendDescriptionTypeProps.md)\<`any`\>

#### Inherited from

[`DescriptionCommonProps`](DescriptionCommonProps.md).[`extendTypes`](DescriptionCommonProps.md#extendtypes)

### faasData?

> `optional` **faasData?**: `undefined`

Must not be set when using a local `dataSource`.

### items

> **items**: ([`DescriptionItemProps`](DescriptionItemProps.md)\<`any`> > > > \> \| `ExtendItemProps`)[]

Item metadata definitions rendered as description entries.

#### Inherited from

[`DescriptionCommonProps`](DescriptionCommonProps.md).[`items`](DescriptionCommonProps.md#items)
