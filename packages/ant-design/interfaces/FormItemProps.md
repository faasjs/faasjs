[@faasjs/ant-design](../README.md) / FormItemProps

# Interface: FormItemProps\<T\>

## Extends

- [`FaasItemProps`](FaasItemProps.md).`Omit`\<`AntdFormItemProps`\<`T`\>, `"id"` \| `"children"` \| `"render"`\>

## Type parameters

• **T** = `any`

## Properties

### children?

> **`optional`** **children**: [`UnionFaasItemElement`](../type-aliases/UnionFaasItemElement.md)\<`T`\>

### col?

> **`optional`** **col**: `number`

### disabled?

> **`optional`** **disabled**: `boolean`

### extendTypes?

> **`optional`** **extendTypes**: [`ExtendTypes`](../type-aliases/ExtendTypes.md)

### formChildren?

> **`optional`** **formChildren**: [`UnionFaasItemElement`](../type-aliases/UnionFaasItemElement.md)\<`T`\>

### formRender?

> **`optional`** **formRender**: [`UnionFaasItemRender`](../type-aliases/UnionFaasItemRender.md)\<`T`\>

### id

> **id**: `string`

#### Inherited from

[`FaasItemProps`](FaasItemProps.md).[`id`](FaasItemProps.md#id)

### if()?

> **`optional`** **if**: (`values`) => `boolean`

trigger when any item's value changed

#### Parameters

• **values**: `Record`\<`string`, `any`\>

#### Returns

`boolean`

### input?

> **`optional`** **input**: `InputProps` \| `InputNumberProps`\<`ValueType`\> \| `SwitchProps` \| `SelectProps`\<`T`, `DefaultOptionType`\> \| `DatePickerProps`

### label?

> **`optional`** **label**: `string` \| `false`

#### Overrides

`Omit.label`

### maxCount?

> **`optional`** **maxCount**: `number`

### object?

> **`optional`** **object**: [`FormItemProps`](FormItemProps.md)\<`any`\>[]

### onValueChange()?

> **`optional`** **onValueChange**: (`value`, `values`, `form`) => `void`

trigger when current item's value changed

#### Parameters

• **value**: `T`

• **values**: `any`

• **form**: `FormInstance`\<`any`\>

#### Returns

`void`

### options?

> **`optional`** **options**: [`BaseOption`](../type-aliases/BaseOption.md)[]

#### Inherited from

[`FaasItemProps`](FaasItemProps.md).[`options`](FaasItemProps.md#options)

### render?

> **`optional`** **render**: [`UnionFaasItemRender`](../type-aliases/UnionFaasItemRender.md)\<`T`\>

### required?

> **`optional`** **required**: `boolean`

#### Overrides

`Omit.required`

### rules?

> **`optional`** **rules**: `RuleObject`[]

#### Overrides

`Omit.rules`

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
