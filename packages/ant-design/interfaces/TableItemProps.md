[@faasjs/ant-design](../README.md) / TableItemProps

# Interface: TableItemProps\<T\>

## Extends

- [`FaasItemProps`](FaasItemProps.md).`Omit`\<`AntdTableColumnProps`\<`T`\>, `"title"` \| `"children"` \| `"render"`\>

## Type parameters

• **T** = `any`

## Properties

### children?

> **`optional`** **children**: [`UnionFaasItemElement`](../type-aliases/UnionFaasItemElement.md)\<`T`\>

### id

> **id**: `string`

#### Inherited from

[`FaasItemProps`](FaasItemProps.md).[`id`](FaasItemProps.md#id)

### object?

> **`optional`** **object**: [`TableItemProps`](TableItemProps.md)\<`T`\>[]

### options?

> **`optional`** **options**: [`BaseOption`](../type-aliases/BaseOption.md)[]

#### Inherited from

[`FaasItemProps`](FaasItemProps.md).[`options`](FaasItemProps.md#options)

### optionsType?

> **`optional`** **optionsType**: `"auto"`

### render?

> **`optional`** **render**: [`UnionFaasItemRender`](../type-aliases/UnionFaasItemRender.md)\<`T`\>

### tableChildren?

> **`optional`** **tableChildren**: [`UnionFaasItemElement`](../type-aliases/UnionFaasItemElement.md)\<`T`\>

### tableRender?

> **`optional`** **tableRender**: [`UnionFaasItemRender`](../type-aliases/UnionFaasItemRender.md)\<`T`\>

### title?

> **`optional`** **title**: `string`

#### Inherited from

[`FaasItemProps`](FaasItemProps.md).[`title`](FaasItemProps.md#title)

### type?

> **`optional`** **type**: [`FaasItemType`](../type-aliases/FaasItemType.md)

Support string, string[], number, number[], boolean, date, time, object, object[]

#### Default

```ts
'string'
```

#### Inherited from

[`FaasItemProps`](FaasItemProps.md).[`type`](FaasItemProps.md#type)
