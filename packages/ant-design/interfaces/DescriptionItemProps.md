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

[`FaasItemProps`](FaasItemProps.md).[`id`](FaasItemProps.md#id)

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

[`FaasItemProps`](FaasItemProps.md).[`options`](FaasItemProps.md#options)

### render?

> **render**?: [`UnionFaasItemRender`](../type-aliases/UnionFaasItemRender.md)\<`T`\>

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
