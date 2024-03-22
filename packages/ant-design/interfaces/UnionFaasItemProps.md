[@faasjs/ant-design](../README.md) / UnionFaasItemProps

# Interface: UnionFaasItemProps\<Value, Values\>

## Extends

- [`FormItemProps`](FormItemProps.md).[`DescriptionItemProps`](DescriptionItemProps.md).[`TableItemProps`](TableItemProps.md)

## Type parameters

• **Value** = `any`

• **Values** = `any`

## Properties

### children?

> **`optional`** **children**: `ReactElement`\<[`UnionFaasItemInjection`](../type-aliases/UnionFaasItemInjection.md)\<[`UnionFaasItemProps`](UnionFaasItemProps.md)\<`Value`, `Values`\>, `any`\>, `string` \| `JSXElementConstructor`\<`any`\>\>

#### Overrides

[`TableItemProps`](TableItemProps.md).[`children`](TableItemProps.md#children)

### col?

> **`optional`** **col**: `number`

#### Inherited from

[`FormItemProps`](FormItemProps.md).[`col`](FormItemProps.md#col)

### descriptionChildren?

> **`optional`** **descriptionChildren**: [`UnionFaasItemElement`](../type-aliases/UnionFaasItemElement.md)\<`any`\>

#### Inherited from

[`DescriptionItemProps`](DescriptionItemProps.md).[`descriptionChildren`](DescriptionItemProps.md#descriptionchildren)

### descriptionRender?

> **`optional`** **descriptionRender**: [`UnionFaasItemRender`](../type-aliases/UnionFaasItemRender.md)\<`any`\>

#### Inherited from

[`DescriptionItemProps`](DescriptionItemProps.md).[`descriptionRender`](DescriptionItemProps.md#descriptionrender)

### disabled?

> **`optional`** **disabled**: `boolean`

#### Inherited from

[`FormItemProps`](FormItemProps.md).[`disabled`](FormItemProps.md#disabled)

### extendTypes?

> **`optional`** **extendTypes**: [`ExtendTypes`](../type-aliases/ExtendTypes.md)

#### Inherited from

[`FormItemProps`](FormItemProps.md).[`extendTypes`](FormItemProps.md#extendtypes)

### formChildren?

> **`optional`** **formChildren**: [`UnionFaasItemElement`](../type-aliases/UnionFaasItemElement.md)\<`any`\>

#### Inherited from

[`FormItemProps`](FormItemProps.md).[`formChildren`](FormItemProps.md#formchildren)

### formRender?

> **`optional`** **formRender**: [`UnionFaasItemRender`](../type-aliases/UnionFaasItemRender.md)\<`any`\>

#### Inherited from

[`FormItemProps`](FormItemProps.md).[`formRender`](FormItemProps.md#formrender)

### id

> **id**: `string`

#### Inherited from

[`TableItemProps`](TableItemProps.md).[`id`](TableItemProps.md#id)

### if()?

> **`optional`** **if**: (`values`) => `boolean`

trigger when any item's value changed

#### Parameters

• **values**: `Record`\<`string`, `any`\>

#### Returns

`boolean`

#### Inherited from

[`DescriptionItemProps`](DescriptionItemProps.md).[`if`](DescriptionItemProps.md#if)

### input?

> **`optional`** **input**: `SelectProps`\<`any`, `DefaultOptionType`\> \| `InputProps` \| `InputNumberProps`\<`ValueType`\> \| `SwitchProps` \| `DatePickerProps`

#### Inherited from

[`FormItemProps`](FormItemProps.md).[`input`](FormItemProps.md#input)

### label?

> **`optional`** **label**: `string` \| `false`

#### Inherited from

[`FormItemProps`](FormItemProps.md).[`label`](FormItemProps.md#label)

### maxCount?

> **`optional`** **maxCount**: `number`

#### Inherited from

[`FormItemProps`](FormItemProps.md).[`maxCount`](FormItemProps.md#maxcount)

### object?

> **`optional`** **object**: [`UnionFaasItemProps`](UnionFaasItemProps.md)\<`Value`, `Values`\>[]

#### Overrides

[`TableItemProps`](TableItemProps.md).[`object`](TableItemProps.md#object)

### onValueChange()?

> **`optional`** **onValueChange**: (`value`, `values`, `form`) => `void`

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

> **`optional`** **options**: [`BaseOption`](../type-aliases/BaseOption.md)[]

#### Inherited from

[`TableItemProps`](TableItemProps.md).[`options`](TableItemProps.md#options)

### optionsType?

> **`optional`** **optionsType**: `"auto"`

#### Inherited from

[`TableItemProps`](TableItemProps.md).[`optionsType`](TableItemProps.md#optionstype)

### render?

> **`optional`** **render**: [`UnionFaasItemRender`](../type-aliases/UnionFaasItemRender.md)\<`any`, `any`\>

#### Overrides

[`TableItemProps`](TableItemProps.md).[`render`](TableItemProps.md#render)

### required?

> **`optional`** **required**: `boolean`

#### Inherited from

[`FormItemProps`](FormItemProps.md).[`required`](FormItemProps.md#required)

### rules?

> **`optional`** **rules**: `RuleObject`[]

#### Inherited from

[`FormItemProps`](FormItemProps.md).[`rules`](FormItemProps.md#rules)

### tableChildren?

> **`optional`** **tableChildren**: [`UnionFaasItemElement`](../type-aliases/UnionFaasItemElement.md)\<`any`\>

#### Inherited from

[`TableItemProps`](TableItemProps.md).[`tableChildren`](TableItemProps.md#tablechildren)

### tableRender?

> **`optional`** **tableRender**: [`UnionFaasItemRender`](../type-aliases/UnionFaasItemRender.md)\<`any`\>

#### Inherited from

[`TableItemProps`](TableItemProps.md).[`tableRender`](TableItemProps.md#tablerender)

### title?

> **`optional`** **title**: `string`

#### Inherited from

[`TableItemProps`](TableItemProps.md).[`title`](TableItemProps.md#title)

### type?

> **`optional`** **type**: [`FaasItemType`](../type-aliases/FaasItemType.md)

Support string, string[], number, number[], boolean, date, time, object, object[]

#### Default

```ts
'string'
```

#### Inherited from

[`TableItemProps`](TableItemProps.md).[`type`](TableItemProps.md#type)
