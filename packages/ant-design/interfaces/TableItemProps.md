# Interface: TableItemProps<T\>

## Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |

## Hierarchy

- [`FaasItemProps`](FaasItemProps.md)

- `Omit`<`AntdTableColumnProps`<`T`\>, ``"title"`` \| ``"children"``\>

  ↳ **`TableItemProps`**

## Table of contents

### Properties

- [children](TableItemProps.md#children)
- [id](TableItemProps.md#id)
- [object](TableItemProps.md#object)
- [options](TableItemProps.md#options)
- [optionsType](TableItemProps.md#optionstype)
- [title](TableItemProps.md#title)
- [type](TableItemProps.md#type)

## Properties

### children

• `Optional` **children**: `Element`

___

### id

• **id**: `string`

#### Inherited from

[FaasItemProps](FaasItemProps.md).[id](FaasItemProps.md#id)

___

### object

• `Optional` **object**: [`TableItemProps`](TableItemProps.md)<`any`\>[]

___

### options

• `Optional` **options**: [`BaseOption`](../modules.md#baseoption)[]

#### Inherited from

[FaasItemProps](FaasItemProps.md).[options](FaasItemProps.md#options)

___

### optionsType

• `Optional` **optionsType**: ``"auto"``

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
