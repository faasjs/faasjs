[@faasjs/ant-design](../README.md) / DescriptionItemProps

# Interface: DescriptionItemProps\<T\>

Item definition used by [Description](../functions/Description.md).

## Extends

- [`FaasItemProps`](FaasItemProps.md)

## Extended by

- [`UnionFaasItemProps`](UnionFaasItemProps.md)

## Type Parameters

### T

`T` = `any`

Value type rendered by the item.

## Properties

### children?

> `optional` **children?**: [`UnionFaasItemElement`](../type-aliases/UnionFaasItemElement.md)\<`T`\> \| `null`

Generic custom element rendered when no description-specific child overrides it.

### descriptionChildren?

> `optional` **descriptionChildren?**: [`UnionFaasItemElement`](../type-aliases/UnionFaasItemElement.md)\<`T`\> \| `null`

Description-specific custom element.

### descriptionRender?

> `optional` **descriptionRender?**: [`UnionFaasItemRender`](../type-aliases/UnionFaasItemRender.md)\<`T`\> \| `null`

Description-specific custom render callback.

### id

> **id**: `string` \| `number`

Stable field identifier used as the default name and title source.

#### Inherited from

[`FaasItemProps`](FaasItemProps.md).[`id`](FaasItemProps.md#id)

### if?

> `optional` **if?**: (`values`) => `boolean`

Predicate used to hide the item for the current record.

#### Parameters

##### values

`Record`\<`string`, `any`\>

#### Returns

`boolean`

### object?

> `optional` **object?**: `DescriptionItemProps`\<`T`\>[]

Nested item definitions used by `object` and `object[]` item types.

### options?

> `optional` **options?**: [`BaseOption`](../type-aliases/BaseOption.md)[]

Shared choice options used by select-like renderers.

#### Inherited from

[`FaasItemProps`](FaasItemProps.md).[`options`](FaasItemProps.md#options)

### render?

> `optional` **render?**: [`UnionFaasItemRender`](../type-aliases/UnionFaasItemRender.md)\<`T`\> \| `null`

Generic custom render callback.

### title?

> `optional` **title?**: `string`

Human-readable title used for labels and table headers.

#### Inherited from

[`FaasItemProps`](FaasItemProps.md).[`title`](FaasItemProps.md#title)

### type?

> `optional` **type?**: [`FaasItemType`](../type-aliases/FaasItemType.md)

Built-in FaasJS field type used to normalize and render values.

#### Default

```ts
'string'
```

#### Inherited from

[`FaasItemProps`](FaasItemProps.md).[`type`](FaasItemProps.md#type)
