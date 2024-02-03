[@faasjs/ant-design](../README.md) / UnionFaasItemProps

# Interface: UnionFaasItemProps\<Value, Values\>

## Extends

- [`FormItemProps`](FormItemProps.md).[`DescriptionItemProps`](DescriptionItemProps.md).[`TableItemProps`](TableItemProps.md)

## Type parameters

• **Value** = `any`

• **Values** = `any`

## Properties

### children?

> **children**?: `ReactElement`\<[`UnionFaasItemInjection`](../type-aliases/UnionFaasItemInjection.md)\<[`UnionFaasItemProps`](UnionFaasItemProps.md)\<`Value`, `Values`\>, `any`\>, `string` \| `JSXElementConstructor`\<`any`\>\>

#### Overrides

[`TableItemProps`](TableItemProps.md).[`children`](TableItemProps.md#children)

### col?

> **col**?: `number`

#### Inherited from

[`FormItemProps`](FormItemProps.md).[`col`](FormItemProps.md#col)

### descriptionChildren?

> **descriptionChildren**?: [`UnionFaasItemElement`](../type-aliases/UnionFaasItemElement.md)\<`any`\>

#### Inherited from

[`DescriptionItemProps`](DescriptionItemProps.md).[`descriptionChildren`](DescriptionItemProps.md#descriptionchildren)

### descriptionRender?

> **descriptionRender**?: [`UnionFaasItemRender`](../type-aliases/UnionFaasItemRender.md)\<`any`\>

#### Inherited from

[`DescriptionItemProps`](DescriptionItemProps.md).[`descriptionRender`](DescriptionItemProps.md#descriptionrender)

### disabled?

> **disabled**?: `boolean`

#### Inherited from

[`FormItemProps`](FormItemProps.md).[`disabled`](FormItemProps.md#disabled)

### extendTypes?

> **extendTypes**?: [`ExtendTypes`](../type-aliases/ExtendTypes.md)

#### Inherited from

[`FormItemProps`](FormItemProps.md).[`extendTypes`](FormItemProps.md#extendtypes)

### formChildren?

> **formChildren**?: [`UnionFaasItemElement`](../type-aliases/UnionFaasItemElement.md)\<`any`\>

#### Inherited from

[`FormItemProps`](FormItemProps.md).[`formChildren`](FormItemProps.md#formchildren)

### formRender?

> **formRender**?: [`UnionFaasItemRender`](../type-aliases/UnionFaasItemRender.md)\<`any`\>

#### Inherited from

[`FormItemProps`](FormItemProps.md).[`formRender`](FormItemProps.md#formrender)

### id

> **id**: `string`

#### Inherited from

[`TableItemProps`](TableItemProps.md).[`id`](TableItemProps.md#id)

### if?

> **if**?: (`values`) => `boolean`

trigger when any item's value changed

#### Parameters

• **values**: `Record`\<`string`, `any`\>

#### Returns

`boolean`

#### Inherited from

[`DescriptionItemProps`](DescriptionItemProps.md).[`if`](DescriptionItemProps.md#if)

### input?

> **input**?: `SelectProps`\<`any`, `DefaultOptionType`\> \| `InputProps` \| `InputNumberProps`\<`ValueType`\> \| `SwitchProps` \| `DatePickerProps`

#### Inherited from

[`FormItemProps`](FormItemProps.md).[`input`](FormItemProps.md#input)

### label?

> **label**?: `string` \| `false`

#### Inherited from

[`FormItemProps`](FormItemProps.md).[`label`](FormItemProps.md#label)

### maxCount?

> **maxCount**?: `number`

#### Inherited from

[`FormItemProps`](FormItemProps.md).[`maxCount`](FormItemProps.md#maxcount)

### object?

> **object**?: [`UnionFaasItemProps`](UnionFaasItemProps.md)\<`Value`, `Values`\>[]

#### Overrides

[`TableItemProps`](TableItemProps.md).[`object`](TableItemProps.md#object)

### onValueChange?

> **onValueChange**?: (`value`, `values`, `form`) => `void`

trigger when current item's value changed

#### Parameters

• **value**: `any`

• **values**: `any`

• **form**: `FormInstance`\<`any`\>

#### Returns

`void`

#### Inherited from

[`FormItemProps`](FormItemProps.md).[`onValueChange`](FormItemProps.md#onvaluechange)

### options?

> **options**?: [`BaseOption`](../type-aliases/BaseOption.md)[]

#### Inherited from

[`TableItemProps`](TableItemProps.md).[`options`](TableItemProps.md#options)

### optionsType?

> **optionsType**?: `"auto"`

#### Inherited from

[`TableItemProps`](TableItemProps.md).[`optionsType`](TableItemProps.md#optionstype)

### render?

> **render**?: [`UnionFaasItemRender`](../type-aliases/UnionFaasItemRender.md)\<`any`, `any`\>

#### Overrides

[`TableItemProps`](TableItemProps.md).[`render`](TableItemProps.md#render)

### required?

> **required**?: `boolean`

#### Inherited from

[`FormItemProps`](FormItemProps.md).[`required`](FormItemProps.md#required)

### rules?

> **rules**?: `RuleObject`[]

#### Inherited from

[`FormItemProps`](FormItemProps.md).[`rules`](FormItemProps.md#rules)

### tableChildren?

> **tableChildren**?: [`UnionFaasItemElement`](../type-aliases/UnionFaasItemElement.md)\<`any`\>

#### Inherited from

[`TableItemProps`](TableItemProps.md).[`tableChildren`](TableItemProps.md#tablechildren)

### tableRender?

> **tableRender**?: [`UnionFaasItemRender`](../type-aliases/UnionFaasItemRender.md)\<`any`\>

#### Inherited from

[`TableItemProps`](TableItemProps.md).[`tableRender`](TableItemProps.md#tablerender)

### title?

> **title**?: `string`

#### Inherited from

[`TableItemProps`](TableItemProps.md).[`title`](TableItemProps.md#title)

### type?

> **type**?: [`FaasItemType`](../type-aliases/FaasItemType.md)

Support string, string[], number, number[], boolean, date, time, object, object[]

#### Default

```ts
'string'
```

#### Inherited from

[`TableItemProps`](TableItemProps.md).[`type`](TableItemProps.md#type)
