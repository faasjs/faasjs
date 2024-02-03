[@faasjs/ant-design](../README.md) / TableItemProps

# Interface: TableItemProps\<T\>

## Extends

- [`FaasItemProps`](FaasItemProps.md).`Omit`\<`AntdTableColumnProps`\<`T`\>, `"title"` \| `"children"` \| `"render"`\>

## Type parameters

• **T** = `any`

## Properties

### children?

> **children**?: [`UnionFaasItemElement`](../type-aliases/UnionFaasItemElement.md)\<`T`\>

### id

> **id**: `string`

#### Inherited from

[`FaasItemProps`](FaasItemProps.md).[`id`](FaasItemProps.md#id)

### object?

> **object**?: [`TableItemProps`](TableItemProps.md)\<`T`\>[]

### options?

> **options**?: [`BaseOption`](../type-aliases/BaseOption.md)[]

#### Inherited from

[`FaasItemProps`](FaasItemProps.md).[`options`](FaasItemProps.md#options)

### optionsType?

> **optionsType**?: `"auto"`

### render?

> **render**?: [`UnionFaasItemRender`](../type-aliases/UnionFaasItemRender.md)\<`T`\>

### tableChildren?

> **tableChildren**?: [`UnionFaasItemElement`](../type-aliases/UnionFaasItemElement.md)\<`T`\>

### tableRender?

> **tableRender**?: [`UnionFaasItemRender`](../type-aliases/UnionFaasItemRender.md)\<`T`\>

### title?

> **title**?: `string`

#### Inherited from

[`FaasItemProps`](FaasItemProps.md).[`title`](FaasItemProps.md#title)

### type?

> **type**?: [`FaasItemType`](../type-aliases/FaasItemType.md)

Support string, string[], number, number[], boolean, date, time, object, object[]

#### Default

```ts
'string'
```

#### Inherited from

[`FaasItemProps`](FaasItemProps.md).[`type`](FaasItemProps.md#type)
