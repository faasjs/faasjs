[@faasjs/ant-design](../README.md) / DescriptionWithFaasProps

# Interface: DescriptionWithFaasProps\<Path, T, ExtendItemProps\>

Props for the [Description](../functions/Description.md) component when fetching data via FaasJS.

## Extends

- [`DescriptionCommonProps`](DescriptionCommonProps.md)\<`T`, `ExtendItemProps`\>

## Type Parameters

### Path

`Path` _extends_ `FaasActionPaths` = `any`

Action path type inferred from `faasData.action`.

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

> `optional` **dataSource?**: `undefined`

Must not be set when using `faasData`.

### extendTypes?

> `optional` **extendTypes?**: `object`

Custom type renderers keyed by item type.

#### Index Signature

\[`key`: `string`\]: [`ExtendDescriptionTypeProps`](../type-aliases/ExtendDescriptionTypeProps.md)\<`any`\>

#### Inherited from

[`DescriptionCommonProps`](DescriptionCommonProps.md).[`extendTypes`](DescriptionCommonProps.md#extendtypes)

### faasData?

> `optional` **faasData?**: [`FaasDataWrapperProps`](FaasDataWrapperProps.md)\<`Path`>>>>\>

FaasJS data wrapper configuration that fetches the data source.

### items

> **items**: ([`DescriptionItemProps`](DescriptionItemProps.md)\<`any`> > > > \> \| `ExtendItemProps`)[]

Item metadata definitions rendered as description entries.

#### Inherited from

[`DescriptionCommonProps`](DescriptionCommonProps.md).[`items`](DescriptionCommonProps.md#items)
