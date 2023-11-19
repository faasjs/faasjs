# Interface: FormItemProps\<T\>

## Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |

## Hierarchy

- [`FaasItemProps`](FaasItemProps.md)

- `Omit`\<`AntdFormItemProps`\<`T`\>, ``"id"`` \| ``"children"`` \| ``"render"``\>

  ↳ **`FormItemProps`**

  ↳↳ [`UnionFaasItemProps`](UnionFaasItemProps.md)

## Table of contents

### Properties

- [children](FormItemProps.md#children)
- [col](FormItemProps.md#col)
- [disabled](FormItemProps.md#disabled)
- [extendTypes](FormItemProps.md#extendtypes)
- [formChildren](FormItemProps.md#formchildren)
- [formRender](FormItemProps.md#formrender)
- [id](FormItemProps.md#id)
- [if](FormItemProps.md#if)
- [input](FormItemProps.md#input)
- [label](FormItemProps.md#label)
- [maxCount](FormItemProps.md#maxcount)
- [object](FormItemProps.md#object)
- [onValueChange](FormItemProps.md#onvaluechange)
- [options](FormItemProps.md#options)
- [render](FormItemProps.md#render)
- [required](FormItemProps.md#required)
- [rules](FormItemProps.md#rules)
- [title](FormItemProps.md#title)
- [type](FormItemProps.md#type)

## Properties

### children

• `Optional` **children**: [`UnionFaasItemElement`](../modules.md#unionfaasitemelement)\<`T`\>

___

### col

• `Optional` **col**: `number`

___

### disabled

• `Optional` **disabled**: `boolean`

___

### extendTypes

• `Optional` **extendTypes**: [`ExtendTypes`](../modules.md#extendtypes)

___

### formChildren

• `Optional` **formChildren**: [`UnionFaasItemElement`](../modules.md#unionfaasitemelement)\<`T`\>

___

### formRender

• `Optional` **formRender**: [`UnionFaasItemRender`](../modules.md#unionfaasitemrender)\<`T`\>

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

trigger when any item's value changed

##### Parameters

| Name | Type |
| :------ | :------ |
| `values` | `Record`\<`string`, `any`\> |

##### Returns

`boolean`

___

### input

• `Optional` **input**: `InputProps` \| `InputNumberProps`\<`ValueType`\> \| `SwitchProps` \| `SelectProps`\<`T`, `DefaultOptionType`\> \| `DatePickerProps` \| `TimePickerProps`

___

### label

• `Optional` **label**: `string` \| ``false``

#### Overrides

Omit.label

___

### maxCount

• `Optional` **maxCount**: `number`

___

### object

• `Optional` **object**: [`FormItemProps`](FormItemProps.md)\<`any`\>[]

___

### onValueChange

• `Optional` **onValueChange**: (`value`: `T`, `values`: `any`, `form`: `FormInstance`\<`any`\>) => `void`

#### Type declaration

▸ (`value`, `values`, `form`): `void`

trigger when current item's value changed

##### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `T` |
| `values` | `any` |
| `form` | `FormInstance`\<`any`\> |

##### Returns

`void`

___

### options

• `Optional` **options**: [`BaseOption`](../modules.md#baseoption)[]

#### Inherited from

[FaasItemProps](FaasItemProps.md).[options](FaasItemProps.md#options)

___

### render

• `Optional` **render**: [`UnionFaasItemRender`](../modules.md#unionfaasitemrender)\<`T`\>

___

### required

• `Optional` **required**: `boolean`

#### Overrides

Omit.required

___

### rules

• `Optional` **rules**: `RuleObject`[]

#### Overrides

Omit.rules

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
