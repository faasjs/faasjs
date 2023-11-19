# Interface: UnionFaasItemProps\<Value, Values\>

## Type parameters

| Name | Type |
| :------ | :------ |
| `Value` | `any` |
| `Values` | `any` |

## Hierarchy

- [`FormItemProps`](FormItemProps.md)

- [`DescriptionItemProps`](DescriptionItemProps.md)

- [`TableItemProps`](TableItemProps.md)

  ↳ **`UnionFaasItemProps`**

## Table of contents

### Properties

- [children](UnionFaasItemProps.md#children)
- [col](UnionFaasItemProps.md#col)
- [descriptionChildren](UnionFaasItemProps.md#descriptionchildren)
- [descriptionRender](UnionFaasItemProps.md#descriptionrender)
- [disabled](UnionFaasItemProps.md#disabled)
- [extendTypes](UnionFaasItemProps.md#extendtypes)
- [formChildren](UnionFaasItemProps.md#formchildren)
- [formRender](UnionFaasItemProps.md#formrender)
- [id](UnionFaasItemProps.md#id)
- [if](UnionFaasItemProps.md#if)
- [input](UnionFaasItemProps.md#input)
- [label](UnionFaasItemProps.md#label)
- [maxCount](UnionFaasItemProps.md#maxcount)
- [object](UnionFaasItemProps.md#object)
- [onValueChange](UnionFaasItemProps.md#onvaluechange)
- [options](UnionFaasItemProps.md#options)
- [optionsType](UnionFaasItemProps.md#optionstype)
- [render](UnionFaasItemProps.md#render)
- [required](UnionFaasItemProps.md#required)
- [rules](UnionFaasItemProps.md#rules)
- [tableChildren](UnionFaasItemProps.md#tablechildren)
- [tableRender](UnionFaasItemProps.md#tablerender)
- [title](UnionFaasItemProps.md#title)
- [type](UnionFaasItemProps.md#type)

## Properties

### children

• `Optional` **children**: `ReactElement`\<[`UnionFaasItemInjection`](../modules.md#unionfaasiteminjection)\<[`UnionFaasItemProps`](UnionFaasItemProps.md)\<`Value`, `Values`\>, `any`\>, `string` \| `JSXElementConstructor`\<`any`\>\>

#### Overrides

[TableItemProps](TableItemProps.md).[children](TableItemProps.md#children)

___

### col

• `Optional` **col**: `number`

#### Inherited from

[FormItemProps](FormItemProps.md).[col](FormItemProps.md#col)

___

### descriptionChildren

• `Optional` **descriptionChildren**: [`UnionFaasItemElement`](../modules.md#unionfaasitemelement)\<`any`\>

#### Inherited from

[DescriptionItemProps](DescriptionItemProps.md).[descriptionChildren](DescriptionItemProps.md#descriptionchildren)

___

### descriptionRender

• `Optional` **descriptionRender**: [`UnionFaasItemRender`](../modules.md#unionfaasitemrender)\<`any`\>

#### Inherited from

[DescriptionItemProps](DescriptionItemProps.md).[descriptionRender](DescriptionItemProps.md#descriptionrender)

___

### disabled

• `Optional` **disabled**: `boolean`

#### Inherited from

[FormItemProps](FormItemProps.md).[disabled](FormItemProps.md#disabled)

___

### extendTypes

• `Optional` **extendTypes**: [`ExtendTypes`](../modules.md#extendtypes)

#### Inherited from

[FormItemProps](FormItemProps.md).[extendTypes](FormItemProps.md#extendtypes)

___

### formChildren

• `Optional` **formChildren**: [`UnionFaasItemElement`](../modules.md#unionfaasitemelement)\<`any`\>

#### Inherited from

[FormItemProps](FormItemProps.md).[formChildren](FormItemProps.md#formchildren)

___

### formRender

• `Optional` **formRender**: [`UnionFaasItemRender`](../modules.md#unionfaasitemrender)\<`any`\>

#### Inherited from

[FormItemProps](FormItemProps.md).[formRender](FormItemProps.md#formrender)

___

### id

• **id**: `string`

#### Inherited from

[TableItemProps](TableItemProps.md).[id](TableItemProps.md#id)

___

### if

• `Optional` **if**: (`values`: `Record`\<`string`, `any`\>) => `boolean`

#### Type declaration

▸ (`values`): `boolean`

trigger when any item's value changed

##### Parameters

| Name | Type |
| :------ | :------ |
| `values` | `Record`\<`string`, `any`\> |

##### Returns

`boolean`

#### Inherited from

[DescriptionItemProps](DescriptionItemProps.md).[if](DescriptionItemProps.md#if)

___

### input

• `Optional` **input**: `SelectProps`\<`any`, `DefaultOptionType`\> \| `InputProps` \| `InputNumberProps`\<`ValueType`\> \| `SwitchProps` \| `DatePickerProps` \| `TimePickerProps`

#### Inherited from

[FormItemProps](FormItemProps.md).[input](FormItemProps.md#input)

___

### label

• `Optional` **label**: `string` \| ``false``

#### Inherited from

[FormItemProps](FormItemProps.md).[label](FormItemProps.md#label)

___

### maxCount

• `Optional` **maxCount**: `number`

#### Inherited from

[FormItemProps](FormItemProps.md).[maxCount](FormItemProps.md#maxcount)

___

### object

• `Optional` **object**: [`UnionFaasItemProps`](UnionFaasItemProps.md)\<`Value`, `Values`\>[]

#### Overrides

[TableItemProps](TableItemProps.md).[object](TableItemProps.md#object)

___

### onValueChange

• `Optional` **onValueChange**: (`value`: `any`, `values`: `any`, `form`: `FormInstance`\<`any`\>) => `void`

#### Type declaration

▸ (`value`, `values`, `form`): `void`

trigger when current item's value changed

##### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `any` |
| `values` | `any` |
| `form` | `FormInstance`\<`any`\> |

##### Returns

`void`

#### Inherited from

[FormItemProps](FormItemProps.md).[onValueChange](FormItemProps.md#onvaluechange)

___

### options

• `Optional` **options**: [`BaseOption`](../modules.md#baseoption)[]

#### Inherited from

[TableItemProps](TableItemProps.md).[options](TableItemProps.md#options)

___

### optionsType

• `Optional` **optionsType**: ``"auto"``

#### Inherited from

[TableItemProps](TableItemProps.md).[optionsType](TableItemProps.md#optionstype)

___

### render

• `Optional` **render**: [`UnionFaasItemRender`](../modules.md#unionfaasitemrender)\<`any`, `any`\>

#### Overrides

[TableItemProps](TableItemProps.md).[render](TableItemProps.md#render)

___

### required

• `Optional` **required**: `boolean`

#### Inherited from

[FormItemProps](FormItemProps.md).[required](FormItemProps.md#required)

___

### rules

• `Optional` **rules**: `RuleObject`[]

#### Inherited from

[FormItemProps](FormItemProps.md).[rules](FormItemProps.md#rules)

___

### tableChildren

• `Optional` **tableChildren**: [`UnionFaasItemElement`](../modules.md#unionfaasitemelement)\<`any`\>

#### Inherited from

[TableItemProps](TableItemProps.md).[tableChildren](TableItemProps.md#tablechildren)

___

### tableRender

• `Optional` **tableRender**: [`UnionFaasItemRender`](../modules.md#unionfaasitemrender)\<`any`\>

#### Inherited from

[TableItemProps](TableItemProps.md).[tableRender](TableItemProps.md#tablerender)

___

### title

• `Optional` **title**: `string`

#### Inherited from

[TableItemProps](TableItemProps.md).[title](TableItemProps.md#title)

___

### type

• `Optional` **type**: [`FaasItemType`](../modules.md#faasitemtype)

Support string, string[], number, number[], boolean, date, time, object, object[]

**`Default`**

```ts
'string'
```

#### Inherited from

[TableItemProps](TableItemProps.md).[type](TableItemProps.md#type)
