[@faasjs/ant-design](../README.md) / DescriptionWithFaasProps

# Interface: DescriptionWithFaasProps\<Path, T, ExtendItemProps\>

## Extends

- [`DescriptionCommonProps`](DescriptionCommonProps.md)\<`T`, `ExtendItemProps`\>

## Type Parameters

### Path

`Path` _extends_ `FaasActionPaths` = `any`

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

#### Inherited from

[`DescriptionCommonProps`](DescriptionCommonProps.md).[`renderTitle`](DescriptionCommonProps.md#rendertitle)

## Properties

### dataSource?

> `optional` **dataSource?**: `undefined`

### extendTypes?

> `optional` **extendTypes?**: `object`

#### Index Signature

\[`key`: `string`\]: [`ExtendDescriptionTypeProps`](../type-aliases/ExtendDescriptionTypeProps.md)\<`any`\>

#### Inherited from

[`DescriptionCommonProps`](DescriptionCommonProps.md).[`extendTypes`](DescriptionCommonProps.md#extendtypes)

### faasData?

> `optional` **faasData?**: [`FaasDataWrapperProps`](FaasDataWrapperProps.md)\<`Path`\>

### items

> **items**: ([`DescriptionItemProps`](DescriptionItemProps.md)\<`any`\> \| `ExtendItemProps`)[]

#### Inherited from

[`DescriptionCommonProps`](DescriptionCommonProps.md).[`items`](DescriptionCommonProps.md#items)
