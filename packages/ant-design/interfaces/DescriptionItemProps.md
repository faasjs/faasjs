[@faasjs/ant-design](../README.md) / DescriptionItemProps

# Interface: DescriptionItemProps\<T\>

## Extends

- [`FaasItemProps`](FaasItemProps.md)

## Type parameters

• **T** = `any`

## Properties

### children?

> **`optional`** **children**: [`UnionFaasItemElement`](../type-aliases/UnionFaasItemElement.md)\<`T`\>

### descriptionChildren?

> **`optional`** **descriptionChildren**: [`UnionFaasItemElement`](../type-aliases/UnionFaasItemElement.md)\<`T`\>

### descriptionRender?

> **`optional`** **descriptionRender**: [`UnionFaasItemRender`](../type-aliases/UnionFaasItemRender.md)\<`T`\>

### id

> **id**: `string`

#### Inherited from

[`FaasItemProps`](FaasItemProps.md).[`id`](FaasItemProps.md#id)

### if?

> **`optional`** **if**: (`values`) => `boolean`

#### Parameters

• **values**: `Record`\<`string`, `any`\>

#### Returns

`boolean`

### object?

> **`optional`** **object**: [`DescriptionItemProps`](DescriptionItemProps.md)\<`T`\>[]

### options?

> **`optional`** **options**: [`BaseOption`](../type-aliases/BaseOption.md)[]

#### Inherited from

[`FaasItemProps`](FaasItemProps.md).[`options`](FaasItemProps.md#options)

### render?

> **`optional`** **render**: [`UnionFaasItemRender`](../type-aliases/UnionFaasItemRender.md)\<`T`\>

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
