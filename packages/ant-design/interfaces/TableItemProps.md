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

[`FaasItemProps.id`](FaasItemProps.md#id)

### object?

> **object**?: [`TableItemProps`](TableItemProps.md)\<`T`\>[]

### options?

> **options**?: [`BaseOption`](../type-aliases/BaseOption.md)[]

#### Inherited from

[`FaasItemProps.options`](FaasItemProps.md#options)

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

[`FaasItemProps.title`](FaasItemProps.md#title)

### type?

> **type**?: [`FaasItemType`](../type-aliases/FaasItemType.md)

Support string, string[], number, number[], boolean, date, time, object, object[]

#### Default

```ts
'string'
```

#### Inherited from

[`FaasItemProps.type`](FaasItemProps.md#type)
