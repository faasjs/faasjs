[@faasjs/ant-design](../README.md) / FormItemProps

# Interface: FormItemProps\<T\>

## Extends

- [`FaasItemProps`](FaasItemProps.md).`Omit`\<`AntdFormItemProps`\<`T`\>, `"id"` \| `"children"` \| `"render"`\>

## Type parameters

• **T** = `any`

## Properties

### children?

> **children**?: [`UnionFaasItemElement`](../type-aliases/UnionFaasItemElement.md)\<`T`\>

### col?

> **col**?: `number`

### disabled?

> **disabled**?: `boolean`

### extendTypes?

> **extendTypes**?: [`ExtendTypes`](../type-aliases/ExtendTypes.md)

### formChildren?

> **formChildren**?: [`UnionFaasItemElement`](../type-aliases/UnionFaasItemElement.md)\<`T`\>

### formRender?

> **formRender**?: [`UnionFaasItemRender`](../type-aliases/UnionFaasItemRender.md)\<`T`\>

### id

> **id**: `string`

#### Inherited from

[`FaasItemProps.id`](FaasItemProps.md#id)

### if?

> **if**?: (`values`) => `boolean`

trigger when any item's value changed

#### Parameters

• **values**: `Record`\<`string`, `any`\>

#### Returns

`boolean`

### input?

> **input**?: `InputProps` \| `InputNumberProps`\<`ValueType`\> \| `SwitchProps` \| `SelectProps`\<`T`, `DefaultOptionType`\> \| `DatePickerProps`

### label?

> **label**?: `string` \| `false`

#### Overrides

`Omit.label`

### maxCount?

> **maxCount**?: `number`

### object?

> **object**?: [`FormItemProps`](FormItemProps.md)\<`any`\>[]

### onValueChange?

> **onValueChange**?: (`value`, `values`, `form`) => `void`

trigger when current item's value changed

#### Parameters

• **value**: `T`

• **values**: `any`

• **form**: `FormInstance`\<`any`\>

#### Returns

`void`

### options?

> **options**?: [`BaseOption`](../type-aliases/BaseOption.md)[]

#### Inherited from

[`FaasItemProps.options`](FaasItemProps.md#options)

### render?

> **render**?: [`UnionFaasItemRender`](../type-aliases/UnionFaasItemRender.md)\<`T`\>

### required?

> **required**?: `boolean`

#### Overrides

`Omit.required`

### rules?

> **rules**?: `RuleObject`[]

#### Overrides

`Omit.rules`

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
