[**@faasjs/ant-design**](../README.md)

[@faasjs/ant-design](../README.md) / DescriptionItemProps

# Interface: DescriptionItemProps\<T\>

Description item meta-object consumed by the [Description](../functions/Description.md) component.

## Extends

- [`FaasItemProps`](FaasItemProps.md)

## Extended by

- [`UnionFaasItemProps`](UnionFaasItemProps.md)

## Type Parameters

### T

`T` = `any`

Data record shape rendered by the description list.

## Properties

### children?

> `optional` **children?**: [`UnionFaasItemElement`](../type-aliases/UnionFaasItemElement.md)\<`T`> > > > > > \> \| `null`

Generic custom element rendered when no description-specific child overrides it.

### descriptionChildren?

> `optional` **descriptionChildren?**: [`UnionFaasItemElement`](../type-aliases/UnionFaasItemElement.md)\<`T`> > > > > > \> \| `null`

Description-specific custom element.

### descriptionRender?

> `optional` **descriptionRender?**: [`UnionFaasItemRender`](../type-aliases/UnionFaasItemRender.md)\<`T`> > > > > > \> \| `null`

Description-specific custom render callback.

### id

> **id**: `string` \| `number`

#### Inherited from

[`FaasItemProps`](FaasItemProps.md).[`id`](FaasItemProps.md#id)

### if?

> `optional` **if?**: (`values`) => `boolean`

Conditional visibility predicate. When `false`, the item is hidden from the description list.

#### Parameters

##### values

`Record`\<`string`, `any`\>

#### Returns

`boolean`

### object?

> `optional` **object?**: `DescriptionItemProps`\<`T`>>>>>>\>[]

Nested item definitions used by `object` and `object[]` item types.

### options?

> `optional` **options?**: [`BaseOption`](../type-aliases/BaseOption.md)[]

#### Inherited from

[`FaasItemProps`](FaasItemProps.md).[`options`](FaasItemProps.md#options)

### render?

> `optional` **render?**: [`UnionFaasItemRender`](../type-aliases/UnionFaasItemRender.md)\<`T`> > > > > > \> \| `null`

Generic custom render callback.

### title?

> `optional` **title?**: `string`

#### Inherited from

[`FaasItemProps`](FaasItemProps.md).[`title`](FaasItemProps.md#title)

### type?

> `optional` **type?**: [`FaasItemType`](../type-aliases/FaasItemType.md)

#### Inherited from

[`FaasItemProps`](FaasItemProps.md).[`type`](FaasItemProps.md#type)
