[@faasjs/ant-design](../README.md) / FormItemProps

# Interface: FormItemProps\<T\>

## Extends

- [`BaseItemProps`](BaseItemProps.md).`Omit`\<`AntdFormItemProps`\<`T`\>, `"id"` \| `"children"` \| `"render"`\>

## Extended by

- [`UnionFaasItemProps`](UnionFaasItemProps.md)

## Type Parameters

• **T** = `any`

## Properties

### children?

> `optional` **children**: [`UnionFaasItemElement`](../type-aliases/UnionFaasItemElement.md)\<`T`\>

### col?

> `optional` **col**: `number`

### disabled?

> `optional` **disabled**: `boolean`

### extendTypes?

> `optional` **extendTypes**: [`ExtendTypes`](../type-aliases/ExtendTypes.md)

### formChildren?

> `optional` **formChildren**: [`UnionFaasItemElement`](../type-aliases/UnionFaasItemElement.md)\<`T`\>

### formRender?

> `optional` **formRender**: [`UnionFaasItemRender`](../type-aliases/UnionFaasItemRender.md)\<`T`\>

### id

> **id**: `string`

#### Inherited from

[`BaseItemProps`](BaseItemProps.md).[`id`](BaseItemProps.md#id)

### if()?

> `optional` **if**: (`values`) => `boolean`

trigger when any item's value changed

#### Parameters

##### values

`Record`\<`string`, `any`\>

#### Returns

`boolean`

### input?

> `optional` **input**: `InputProps` \| `RadioProps` \| `InputNumberProps`\<`ValueType`\> \| `SwitchProps` \| `DatePickerProps` \| `SelectProps`\<`T`, `DefaultOptionType`\>

### label?

> `optional` **label**: `string` \| `false`

#### Overrides

`Omit.label`

### maxCount?

> `optional` **maxCount**: `number`

### object?

> `optional` **object**: [`FormItemProps`](FormItemProps.md)\<`any`\>[]

### onValueChange()?

> `optional` **onValueChange**: (`value`, `values`, `form`) => `void`

trigger when current item's value changed

#### Parameters

##### value

`T`

##### values

`any`

##### form

`FormInstance`

#### Returns

`void`

### options?

> `optional` **options**: [`BaseOption`](../type-aliases/BaseOption.md)[]

#### Inherited from

[`BaseItemProps`](BaseItemProps.md).[`options`](BaseItemProps.md#options)

### render?

> `optional` **render**: [`UnionFaasItemRender`](../type-aliases/UnionFaasItemRender.md)\<`T`\>

### required?

> `optional` **required**: `boolean`

#### Overrides

`Omit.required`

### rules?

> `optional` **rules**: `RuleObject`[]

#### Overrides

`Omit.rules`

### title?

> `optional` **title**: `string`

#### Inherited from

[`BaseItemProps`](BaseItemProps.md).[`title`](BaseItemProps.md#title)

### type?

> `optional` **type**: [`FaasItemType`](../type-aliases/FaasItemType.md)
