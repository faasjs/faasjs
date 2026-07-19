[**@faasjs/ant-design**](../README.md)

[@faasjs/ant-design](../README.md) / FormItemProps

# Interface: FormItemProps\<T\>

Props for the [FormItem](../functions/FormItem.md) component.

Each field can render as a single form control, a list of controls, or a nested object/object-list
group of child form items.

## Extends

- [`BaseItemProps`](BaseItemProps.md).`Omit`\<`AntdFormItemProps`\<`T`\>, `"id"` \| `"children"` \| `"render"`\>

## Extended by

- [`UnionFaasItemProps`](UnionFaasItemProps.md)

## Type Parameters

### T

`T` = `any`

Value type rendered or edited by the form item.

## Properties

### children?

> `optional` **children?**: [`UnionFaasItemElement`](../type-aliases/UnionFaasItemElement.md)\<`T`> > > > \> \| `null`

Generic custom element rendered when no form-specific child overrides it.

### col?

> `optional` **col?**: `number`

Number of columns taken by this field in the Ant Design grid.

### disabled?

> `optional` **disabled?**: `boolean`

Whether the field is disabled.

### extendTypes?

> `optional` **extendTypes?**: [`ExtendTypes`](../type-aliases/ExtendTypes.md)

Custom type renderers keyed by item type.

### formChildren?

> `optional` **formChildren?**: [`UnionFaasItemElement`](../type-aliases/UnionFaasItemElement.md)\<`T`> > > > \> \| `null`

Form-specific custom element.

### formRender?

> `optional` **formRender?**: [`UnionFaasItemRender`](../type-aliases/UnionFaasItemRender.md)\<`T`> > > > \> \| `null`

Form-specific custom render callback.

### id

> **id**: `string` \| `number`

#### Inherited from

[`BaseItemProps`](BaseItemProps.md).[`id`](BaseItemProps.md#id)

### if?

> `optional` **if?**: (`values`) => `boolean`

Conditional visibility predicate. When `false`, the field is hidden and rendered as a hidden input.

#### Parameters

##### values

`Record`\<`string`, `any`\>

#### Returns

`boolean`

### input?

> `optional` **input?**: `InputProps` \| `RadioProps` \| `InputNumberProps`\<`ValueType`> > > > \> \| `SwitchProps` \| `DatePickerProps` \| `SelectProps`\<`T`, `DefaultOptionType`>>>>\>

Props forwarded to the Ant Design input component used for this field.

### label?

> `optional` **label?**: `string` \| `false`

Field label text, or `false` to hide the label.

#### Overrides

`Omit.label`

### maxCount?

> `optional` **maxCount?**: `number`

Maximum number of entries allowed in a list item.

### object?

> `optional` **object?**: `FormItemProps`\<`any`>>>>\>[]

Nested item definitions used by `object` and `object[]` item types.

### onValueChange?

> `optional` **onValueChange?**: (`value`, `values`, `form`) => `void`

Called when the field value changes.

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

> `optional` **options?**: [`BaseOption`](../type-aliases/BaseOption.md)[]

#### Inherited from

[`BaseItemProps`](BaseItemProps.md).[`options`](BaseItemProps.md#options)

### render?

> `optional` **render?**: [`UnionFaasItemRender`](../type-aliases/UnionFaasItemRender.md)\<`T`> > > > \> \| `null`

Generic custom render callback.

### required?

> `optional` **required?**: `boolean`

Whether the field is required. When `true`, a required validation rule is appended.

#### Overrides

`Omit.required`

### rules?

> `optional` **rules?**: `RuleObject`[]

Validation rules appended to the field.

#### Overrides

`Omit.rules`

### title?

> `optional` **title?**: `string`

#### Inherited from

[`BaseItemProps`](BaseItemProps.md).[`title`](BaseItemProps.md#title)

### type?

> `optional` **type?**: [`FaasItemType`](../type-aliases/FaasItemType.md)

Item type that determines which Ant Design control is rendered.
