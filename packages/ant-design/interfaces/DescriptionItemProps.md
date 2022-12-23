# Interface: DescriptionItemProps<T\>

## Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |

## Hierarchy

- [`FaasItemProps`](FaasItemProps.md)

  ↳ **`DescriptionItemProps`**

## Table of contents

### Properties

- [children](DescriptionItemProps.md#children)
- [id](DescriptionItemProps.md#id)
- [if](DescriptionItemProps.md#if)
- [object](DescriptionItemProps.md#object)
- [options](DescriptionItemProps.md#options)
- [render](DescriptionItemProps.md#render)
- [title](DescriptionItemProps.md#title)
- [type](DescriptionItemProps.md#type)

## Properties

### children

• `Optional` **children**: `Element`

___

### id

• **id**: `string`

#### Inherited from

[FaasItemProps](FaasItemProps.md).[id](FaasItemProps.md#id)

___

### if

• `Optional` **if**: (`values`: `Record`<`string`, `any`\>) => `boolean`

#### Type declaration

▸ (`values`): `boolean`

##### Parameters

| Name | Type |
| :------ | :------ |
| `values` | `Record`<`string`, `any`\> |

##### Returns

`boolean`

___

### object

• `Optional` **object**: [`DescriptionItemProps`](DescriptionItemProps.md)<`any`\>[]

___

### options

• `Optional` **options**: [`BaseOption`](../modules.md#baseoption)[]

#### Inherited from

[FaasItemProps](FaasItemProps.md).[options](FaasItemProps.md#options)

___

### render

• `Optional` **render**: (`value`: `T`, `values`: `any`) => `Element`

#### Type declaration

▸ (`value`, `values`): `Element`

##### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `T` |
| `values` | `any` |

##### Returns

`Element`

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

'string'

#### Inherited from

[FaasItemProps](FaasItemProps.md).[type](FaasItemProps.md#type)
