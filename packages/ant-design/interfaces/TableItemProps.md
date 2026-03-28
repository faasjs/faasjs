[@faasjs/ant-design](../README.md) / TableItemProps

# Interface: TableItemProps\<T\>

Column definition used by the FaasJS Ant Design [Table](../functions/Table.md) component.

## Extends

- [`FaasItemProps`](FaasItemProps.md).`Omit`\<`AntdTableColumnProps`\<`T`\>, `"title"` \| `"children"` \| `"render"`\>

## Extended by

- [`UnionFaasItemProps`](UnionFaasItemProps.md)

## Type Parameters

### T

`T` = `any`

Row record type rendered by the table.

## Properties

### children?

> `optional` **children?**: [`UnionFaasItemElement`](../type-aliases/UnionFaasItemElement.md)\<`T`\> \| `null`

Generic custom element rendered when no table-specific child overrides it.

### id

> **id**: `string` \| `number`

Stable field identifier used as the default name and title source.

#### Inherited from

[`FaasItemProps`](FaasItemProps.md).[`id`](FaasItemProps.md#id)

### object?

> `optional` **object?**: `TableItemProps`\<`T`\>[]

Nested item definitions used by `object` and `object[]` item types.

### options?

> `optional` **options?**: [`BaseOption`](../type-aliases/BaseOption.md)[]

Shared choice options used by select-like renderers.

#### Inherited from

[`FaasItemProps`](FaasItemProps.md).[`options`](FaasItemProps.md#options)

### optionsType?

> `optional` **optionsType?**: `"auto"`

Use built-in option inference for filters when supported.

### render?

> `optional` **render?**: [`UnionFaasItemRender`](../type-aliases/UnionFaasItemRender.md)\<`T`\> \| `null`

Generic custom render callback.

### tableChildren?

> `optional` **tableChildren?**: [`UnionFaasItemElement`](../type-aliases/UnionFaasItemElement.md)\<`T`\> \| `null`

Table-specific custom element.

### tableRender?

> `optional` **tableRender?**: [`UnionFaasItemRender`](../type-aliases/UnionFaasItemRender.md)\<`T`\> \| `null`

Table-specific custom render callback.

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
