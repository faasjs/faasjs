[@faasjs/ant-design](../README.md) / TableItemProps

# Interface: TableItemProps\<T\>

## Extends

- [`FaasItemProps`](FaasItemProps.md).`Omit`\<`AntdTableColumnProps`\<`T`\>, `"title"` \| `"children"` \| `"render"`\>

## Extended by

- [`UnionFaasItemProps`](UnionFaasItemProps.md)

## Type Parameters

### T

`T` = `any`

## Properties

### children?

> `optional` **children**: [`UnionFaasItemElement`](../type-aliases/UnionFaasItemElement.md)\<`T`\> \| `null`

### id

> **id**: `string` \| `number`

#### Inherited from

[`FaasItemProps`](FaasItemProps.md).[`id`](FaasItemProps.md#id)

### object?

> `optional` **object**: `TableItemProps`\<`T`\>[]

### options?

> `optional` **options**: [`BaseOption`](../type-aliases/BaseOption.md)[]

#### Inherited from

[`FaasItemProps`](FaasItemProps.md).[`options`](FaasItemProps.md#options)

### optionsType?

> `optional` **optionsType**: `"auto"`

### render?

> `optional` **render**: [`UnionFaasItemRender`](../type-aliases/UnionFaasItemRender.md)\<`T`\> \| `null`

### tableChildren?

> `optional` **tableChildren**: [`UnionFaasItemElement`](../type-aliases/UnionFaasItemElement.md)\<`T`\> \| `null`

### tableRender?

> `optional` **tableRender**: [`UnionFaasItemRender`](../type-aliases/UnionFaasItemRender.md)\<`T`\> \| `null`

### title?

> `optional` **title**: `string`

#### Inherited from

[`FaasItemProps`](FaasItemProps.md).[`title`](FaasItemProps.md#title)

### type?

> `optional` **type**: [`FaasItemType`](../type-aliases/FaasItemType.md)

Support string, string[], number, number[], boolean, date, time, object, object[]

#### Default

```ts
'string'
```

#### Inherited from

[`FaasItemProps`](FaasItemProps.md).[`type`](FaasItemProps.md#type)
