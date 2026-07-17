[@faasjs/ant-design](../README.md) / ExtendFormItemProps

# Interface: ExtendFormItemProps

Extensible form item props that accept any string `type`.

## Extends

- `Omit`\<[`FormItemProps`](FormItemProps.md), `"type"`\>

## Properties

### children?

> `optional` **children?**: [`UnionFaasItemElement`](../type-aliases/UnionFaasItemElement.md)\<`any`> > > > \> \| `null`

Generic custom element rendered when no form-specific child overrides it.

#### Inherited from

`Omit.children`

### col?

> `optional` **col?**: `number`

Number of columns taken by this field in the Ant Design grid.

#### Inherited from

[`UnionFaasItemProps`](UnionFaasItemProps.md).[`col`](UnionFaasItemProps.md#col)

### disabled?

> `optional` **disabled?**: `boolean`

Whether the field is disabled.

#### Inherited from

[`UnionFaasItemProps`](UnionFaasItemProps.md).[`disabled`](UnionFaasItemProps.md#disabled)

### extendTypes?

> `optional` **extendTypes?**: [`ExtendTypes`](../type-aliases/ExtendTypes.md)

Custom type renderers keyed by item type.

#### Inherited from

[`UnionFaasItemProps`](UnionFaasItemProps.md).[`extendTypes`](UnionFaasItemProps.md#extendtypes)

### formChildren?

> `optional` **formChildren?**: [`UnionFaasItemElement`](../type-aliases/UnionFaasItemElement.md)\<`any`> > > > \> \| `null`

Form-specific custom element.

#### Inherited from

`Omit.formChildren`

### formRender?

> `optional` **formRender?**: [`UnionFaasItemRender`](../type-aliases/UnionFaasItemRender.md)\<`any`> > > > \> \| `null`

Form-specific custom render callback.

#### Inherited from

`Omit.formRender`

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

#### Inherited from

`Omit.if`

### input?

> `optional` **input?**: `InputProps` \| `RadioProps` \| `InputNumberProps`\<`ValueType`> > > > \> \| `SwitchProps` \| `DatePickerProps` \| `SelectProps`\<`any`, `DefaultOptionType`>>>>\>

Props forwarded to the Ant Design input component used for this field.

#### Inherited from

`Omit.input`

### label?

> `optional` **label?**: `string` \| `false`

Field label text, or `false` to hide the label.

#### Inherited from

[`UnionFaasItemProps`](UnionFaasItemProps.md).[`label`](UnionFaasItemProps.md#label)

### maxCount?

> `optional` **maxCount?**: `number`

Maximum number of entries allowed in a list item.

#### Inherited from

[`UnionFaasItemProps`](UnionFaasItemProps.md).[`maxCount`](UnionFaasItemProps.md#maxcount)

### object?

> `optional` **object?**: [`FormItemProps`](FormItemProps.md)\<`any`>>>>\>[]

Nested item definitions used by `object` and `object[]` item types.

#### Inherited from

`Omit.object`

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

`Omit.onValueChange`

### options?

> `optional` **options?**: [`BaseOption`](../type-aliases/BaseOption.md)[]

#### Inherited from

[`BaseItemProps`](BaseItemProps.md).[`options`](BaseItemProps.md#options)

### render?

> `optional` **render?**: [`UnionFaasItemRender`](../type-aliases/UnionFaasItemRender.md)\<`any`> > > > \> \| `null`

Generic custom render callback.

#### Inherited from

`Omit.render`

### required?

> `optional` **required?**: `boolean`

Whether the field is required. When `true`, a required validation rule is appended.

#### Inherited from

[`UnionFaasItemProps`](UnionFaasItemProps.md).[`required`](UnionFaasItemProps.md#required)

### rules?

> `optional` **rules?**: `RuleObject`[]

Validation rules appended to the field.

#### Inherited from

[`UnionFaasItemProps`](UnionFaasItemProps.md).[`rules`](UnionFaasItemProps.md#rules)

### title?

> `optional` **title?**: `string`

#### Inherited from

[`BaseItemProps`](BaseItemProps.md).[`title`](BaseItemProps.md#title)

### type?

> `optional` **type?**: `string`
