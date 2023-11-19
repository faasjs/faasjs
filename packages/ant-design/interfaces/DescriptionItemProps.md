# Interface: DescriptionItemProps\<T\>

## Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |

## Hierarchy

- [`FaasItemProps`](FaasItemProps.md)

  ↳ **`DescriptionItemProps`**

  ↳↳ [`UnionFaasItemProps`](UnionFaasItemProps.md)

## Table of contents

### Properties

- [children](DescriptionItemProps.md#children)
- [descriptionChildren](DescriptionItemProps.md#descriptionchildren)
- [descriptionRender](DescriptionItemProps.md#descriptionrender)
- [id](DescriptionItemProps.md#id)
- [if](DescriptionItemProps.md#if)
- [object](DescriptionItemProps.md#object)
- [options](DescriptionItemProps.md#options)
- [render](DescriptionItemProps.md#render)
- [title](DescriptionItemProps.md#title)
- [type](DescriptionItemProps.md#type)

## Properties

### children

• `Optional` **children**: [`UnionFaasItemElement`](../modules.md#unionfaasitemelement)\<`T`\>

___

### descriptionChildren

• `Optional` **descriptionChildren**: [`UnionFaasItemElement`](../modules.md#unionfaasitemelement)\<`T`\>

___

### descriptionRender

• `Optional` **descriptionRender**: [`UnionFaasItemRender`](../modules.md#unionfaasitemrender)\<`T`\>

___

### id

• **id**: `string`

#### Inherited from

[FaasItemProps](FaasItemProps.md).[id](FaasItemProps.md#id)

___

### if

• `Optional` **if**: (`values`: `Record`\<`string`, `any`\>) => `boolean`

#### Type declaration

▸ (`values`): `boolean`

##### Parameters

| Name | Type |
| :------ | :------ |
| `values` | `Record`\<`string`, `any`\> |

##### Returns

`boolean`

___

### object

• `Optional` **object**: [`DescriptionItemProps`](DescriptionItemProps.md)\<`T`\>[]

___

### options

• `Optional` **options**: [`BaseOption`](../modules.md#baseoption)[]

#### Inherited from

[FaasItemProps](FaasItemProps.md).[options](FaasItemProps.md#options)

___

### render

• `Optional` **render**: [`UnionFaasItemRender`](../modules.md#unionfaasitemrender)\<`T`\>

___

### title

• `Optional` **title**: `string`

#### Inherited from

[FaasItemProps](FaasItemProps.md).[title](FaasItemProps.md#title)

___

### type

• `Optional` **type**: [`FaasItemType`](../modules.md#faasitemtype)

Support string, string[], number, number[], boolean, date, time, object, object[]

**`Default`**

```ts
'string'
```

#### Inherited from

[FaasItemProps](FaasItemProps.md).[type](FaasItemProps.md#type)
