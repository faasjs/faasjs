[@faasjs/ant-design](../README.md) / UnionFaasItemProps

# Interface: UnionFaasItemProps\<Value, Values\>

Combined item props that spans form, description, and table definitions.

## Extends

- [`FormItemProps`](FormItemProps.md).[`DescriptionItemProps`](DescriptionItemProps.md).[`TableItemProps`](TableItemProps.md)

## Type Parameters

### Value

`Value` = `any`

### Values

`Values` = `any`

## Properties

### children?

> `optional` **children?**: [`UnionFaasItemElement`](../type-aliases/UnionFaasItemElement.md)\<`Value`, `Values`> > > > \> \| `null`

Generic custom element rendered when no form-specific child overrides it.

#### Overrides

[`FormItemProps`](FormItemProps.md).[`children`](FormItemProps.md#children)

### col?

> `optional` **col?**: `number`

Number of columns taken by this field in the Ant Design grid.

#### Inherited from

[`FormItemProps`](FormItemProps.md).[`col`](FormItemProps.md#col)

### descriptionChildren?

> `optional` **descriptionChildren?**: [`UnionFaasItemElement`](../type-aliases/UnionFaasItemElement.md)\<`any`> > > > \> \| `null`

Description-specific custom element.

#### Inherited from

[`DescriptionItemProps`](DescriptionItemProps.md).[`descriptionChildren`](DescriptionItemProps.md#descriptionchildren)

### descriptionRender?

> `optional` **descriptionRender?**: [`UnionFaasItemRender`](../type-aliases/UnionFaasItemRender.md)\<`any`> > > > \> \| `null`

Description-specific custom render callback.

#### Inherited from

[`DescriptionItemProps`](DescriptionItemProps.md).[`descriptionRender`](DescriptionItemProps.md#descriptionrender)

### disabled?

> `optional` **disabled?**: `boolean`

Whether the field is disabled.

#### Inherited from

[`FormItemProps`](FormItemProps.md).[`disabled`](FormItemProps.md#disabled)

### extendTypes?

> `optional` **extendTypes?**: [`ExtendTypes`](../type-aliases/ExtendTypes.md)

Custom type renderers keyed by item type.

#### Inherited from

[`FormItemProps`](FormItemProps.md).[`extendTypes`](FormItemProps.md#extendtypes)

### formChildren?

> `optional` **formChildren?**: [`UnionFaasItemElement`](../type-aliases/UnionFaasItemElement.md)\<`any`> > > > \> \| `null`

Form-specific custom element.

#### Inherited from

[`FormItemProps`](FormItemProps.md).[`formChildren`](FormItemProps.md#formchildren)

### formRender?

> `optional` **formRender?**: [`UnionFaasItemRender`](../type-aliases/UnionFaasItemRender.md)\<`any`> > > > \> \| `null`

Form-specific custom render callback.

#### Inherited from

[`FormItemProps`](FormItemProps.md).[`formRender`](FormItemProps.md#formrender)

### id

> **id**: `string` \| `number`

#### Inherited from

[`FormItemProps`](FormItemProps.md).[`id`](FormItemProps.md#id)

### if?

> `optional` **if?**: (`values`) => `boolean`

Conditional visibility predicate. When `false`, the field is hidden and rendered as a hidden input.

#### Parameters

##### values

`Record`\<`string`, `any`\>

#### Returns

`boolean`

#### Inherited from

[`FormItemProps`](FormItemProps.md).[`if`](FormItemProps.md#if)

### input?

> `optional` **input?**: `InputProps` \| `RadioProps` \| `InputNumberProps`\<`ValueType`> > > > \> \| `SwitchProps` \| `DatePickerProps` \| `SelectProps`\<`any`, `DefaultOptionType`>>>>\>

Props forwarded to the Ant Design input component used for this field.

#### Inherited from

[`FormItemProps`](FormItemProps.md).[`input`](FormItemProps.md#input)

### label?

> `optional` **label?**: `string` \| `false`

Field label text, or `false` to hide the label.

#### Inherited from

[`FormItemProps`](FormItemProps.md).[`label`](FormItemProps.md#label)

### maxCount?

> `optional` **maxCount?**: `number`

Maximum number of entries allowed in a list item.

#### Inherited from

[`FormItemProps`](FormItemProps.md).[`maxCount`](FormItemProps.md#maxcount)

### object?

> `optional` **object?**: `UnionFaasItemProps`\<`Value`, `Values`>>>>\>[]

Nested item definitions used by `object` and `object[]` item types.

#### Overrides

[`FormItemProps`](FormItemProps.md).[`object`](FormItemProps.md#object)

### onValueChange?

> `optional` **onValueChange?**: (`value`, `values`, `form`) => `void`

Called when the field value changes.

#### Parameters

##### value

`any`

##### values

`any`

##### form

`FormInstance`

#### Returns

`void`

#### Inherited from

[`FormItemProps`](FormItemProps.md).[`onValueChange`](FormItemProps.md#onvaluechange)

### options?

> `optional` **options?**: [`BaseOption`](../type-aliases/BaseOption.md)[]

#### Inherited from

[`FormItemProps`](FormItemProps.md).[`options`](FormItemProps.md#options)

### optionsType?

> `optional` **optionsType?**: `"auto"`

Use built-in option inference for filters when supported.

#### Inherited from

[`TableItemProps`](TableItemProps.md).[`optionsType`](TableItemProps.md#optionstype)

### render?

> `optional` **render?**: [`UnionFaasItemRender`](../type-aliases/UnionFaasItemRender.md)\<`Value`, `Values`> > > > \> \| `null`

Generic custom render callback.

#### Overrides

[`FormItemProps`](FormItemProps.md).[`render`](FormItemProps.md#render)

### required?

> `optional` **required?**: `boolean`

Whether the field is required. When `true`, a required validation rule is appended.

#### Inherited from

[`FormItemProps`](FormItemProps.md).[`required`](FormItemProps.md#required)

### rules?

> `optional` **rules?**: `RuleObject`[]

Validation rules appended to the field.

#### Inherited from

[`FormItemProps`](FormItemProps.md).[`rules`](FormItemProps.md#rules)

### tableChildren?

> `optional` **tableChildren?**: [`UnionFaasItemElement`](../type-aliases/UnionFaasItemElement.md)\<`any`> > > > \> \| `null`

Table-specific custom element.

#### Inherited from

[`TableItemProps`](TableItemProps.md).[`tableChildren`](TableItemProps.md#tablechildren)

### tableRender?

> `optional` **tableRender?**: [`UnionFaasItemRender`](../type-aliases/UnionFaasItemRender.md)\<`any`> > > > \> \| `null`

Table-specific custom render callback.

#### Inherited from

[`TableItemProps`](TableItemProps.md).[`tableRender`](TableItemProps.md#tablerender)

### title?

> `optional` **title?**: `string`

#### Inherited from

[`FormItemProps`](FormItemProps.md).[`title`](FormItemProps.md#title)

### type?

> `optional` **type?**: [`FaasItemType`](../type-aliases/FaasItemType.md)

Item type that determines which Ant Design control is rendered.

#### Inherited from

[`FormItemProps`](FormItemProps.md).[`type`](FormItemProps.md#type)
