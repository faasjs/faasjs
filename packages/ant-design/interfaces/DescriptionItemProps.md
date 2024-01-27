[@faasjs/ant-design](../README.md) / DescriptionItemProps

# Interface: DescriptionItemProps\<T\>

## Extends

- [`FaasItemProps`](FaasItemProps.md)

## Type parameters

• **T** = `any`

## Properties

### children?

> **children**?: [`UnionFaasItemElement`](../type-aliases/UnionFaasItemElement.md)\<`T`\>

### descriptionChildren?

> **descriptionChildren**?: [`UnionFaasItemElement`](../type-aliases/UnionFaasItemElement.md)\<`T`\>

### descriptionRender?

> **descriptionRender**?: [`UnionFaasItemRender`](../type-aliases/UnionFaasItemRender.md)\<`T`\>

### id

> **id**: `string`

#### Inherited from

[`FaasItemProps.id`](FaasItemProps.md#id)

### if?

> **if**?: (`values`) => `boolean`

#### Parameters

• **values**: `Record`\<`string`, `any`\>

#### Returns

`boolean`

### object?

> **object**?: [`DescriptionItemProps`](DescriptionItemProps.md)\<`T`\>[]

### options?

> **options**?: [`BaseOption`](../type-aliases/BaseOption.md)[]

#### Inherited from

[`FaasItemProps.options`](FaasItemProps.md#options)

### render?

> **render**?: [`UnionFaasItemRender`](../type-aliases/UnionFaasItemRender.md)\<`T`\>

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
