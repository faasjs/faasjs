[@faasjs/ant-design](../README.md) / UnionFaasItemProps

# Interface: UnionFaasItemProps\<Value, Values\>

Shared union item contract that can be reused across `Form`, `Description`, and `Table`.

### Render Priority Order

1. Component-specific null renderers hide the item for that surface.
2. Component-specific children override generic `children`.
3. Component-specific render callbacks override generic `render`.
4. Registered extended types handle unmatched items.
5. Built-in type renderers handle primitive and object values.

## Extends

- [`FormItemProps`](FormItemProps.md).[`DescriptionItemProps`](DescriptionItemProps.md).[`TableItemProps`](TableItemProps.md)

## Type Parameters

### Value

`Value` = `any`

Current item value type.

### Values

`Values` = `any`

Whole record or row type that contains the value.

## Properties

### children?

> `optional` **children?**: [`UnionFaasItemElement`](../type-aliases/UnionFaasItemElement.md)\<`Value`, `Values`\> \| `null`

Shared custom element rendered when no surface-specific child overrides it.

#### Overrides

[`FormItemProps`](FormItemProps.md).[`children`](FormItemProps.md#children)

### col?

> `optional` **col?**: `number`

Grid span used by surrounding object-list layouts.

#### Inherited from

[`FormItemProps`](FormItemProps.md).[`col`](FormItemProps.md#col)

### descriptionChildren?

> `optional` **descriptionChildren?**: [`UnionFaasItemElement`](../type-aliases/UnionFaasItemElement.md)\<`any`\> \| `null`

Description-specific custom element.

#### Inherited from

[`DescriptionItemProps`](DescriptionItemProps.md).[`descriptionChildren`](DescriptionItemProps.md#descriptionchildren)

### descriptionRender?

> `optional` **descriptionRender?**: [`UnionFaasItemRender`](../type-aliases/UnionFaasItemRender.md)\<`any`\> \| `null`

Description-specific custom render callback.

#### Inherited from

[`DescriptionItemProps`](DescriptionItemProps.md).[`descriptionRender`](DescriptionItemProps.md#descriptionrender)

### disabled?

> `optional` **disabled?**: `boolean`

Whether the generated field is disabled.

#### Inherited from

[`FormItemProps`](FormItemProps.md).[`disabled`](FormItemProps.md#disabled)

### extendTypes?

> `optional` **extendTypes?**: [`ExtendTypes`](../type-aliases/ExtendTypes.md)

Custom form item type renderers keyed by type name.

#### Inherited from

[`FormItemProps`](FormItemProps.md).[`extendTypes`](FormItemProps.md#extendtypes)

### formChildren?

> `optional` **formChildren?**: [`UnionFaasItemElement`](../type-aliases/UnionFaasItemElement.md)\<`any`\> \| `null`

Form-specific custom field renderer or element.

#### Inherited from

[`FormItemProps`](FormItemProps.md).[`formChildren`](FormItemProps.md#formchildren)

### formRender?

> `optional` **formRender?**: [`UnionFaasItemRender`](../type-aliases/UnionFaasItemRender.md)\<`any`\> \| `null`

Form-specific custom render callback.

#### Inherited from

[`FormItemProps`](FormItemProps.md).[`formRender`](FormItemProps.md#formrender)

### id

> **id**: `string` \| `number`

Stable field identifier used as the default name and title source.

#### Inherited from

[`FormItemProps`](FormItemProps.md).[`id`](FormItemProps.md#id)

### if?

> `optional` **if?**: (`values`) => `boolean`

Predicate used to show or hide the item from the current form values.

#### Parameters

##### values

`Record`\<`string`, `any`\>

#### Returns

`boolean`

#### Inherited from

[`FormItemProps`](FormItemProps.md).[`if`](FormItemProps.md#if)

### input?

> `optional` **input?**: `InputProps` \| `SelectProps`\<`any`, `DefaultOptionType`\> \| `RadioProps` \| `InputNumberProps`\<`ValueType`\> \| `SwitchProps` \| `DatePickerProps`

Input props forwarded to the generated Ant Design control.

#### Inherited from

[`FormItemProps`](FormItemProps.md).[`input`](FormItemProps.md#input)

### label?

> `optional` **label?**: `string` \| `false`

Label override, or `false` to hide the label completely.

#### Inherited from

[`FormItemProps`](FormItemProps.md).[`label`](FormItemProps.md#label)

### maxCount?

> `optional` **maxCount?**: `number`

Maximum item count allowed for list-style field types.

#### Inherited from

[`FormItemProps`](FormItemProps.md).[`maxCount`](FormItemProps.md#maxcount)

### object?

> `optional` **object?**: `UnionFaasItemProps`\<`Value`, `Values`\>[]

Nested item definitions used by `object` and `object[]` item types.

#### Overrides

[`FormItemProps`](FormItemProps.md).[`object`](FormItemProps.md#object)

### onValueChange?

> `optional` **onValueChange?**: (`value`, `values`, `form`) => `void`

Callback invoked when this field's value changes.

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

Shared choice options used by select-like renderers.

#### Inherited from

[`FormItemProps`](FormItemProps.md).[`options`](FormItemProps.md#options)

### optionsType?

> `optional` **optionsType?**: `"auto"`

Use built-in option inference for filters when supported.

#### Inherited from

[`TableItemProps`](TableItemProps.md).[`optionsType`](TableItemProps.md#optionstype)

### render?

> `optional` **render?**: [`UnionFaasItemRender`](../type-aliases/UnionFaasItemRender.md)\<`Value`, `Values`\> \| `null`

Shared render callback used when no surface-specific render overrides it.

#### Overrides

[`FormItemProps`](FormItemProps.md).[`render`](FormItemProps.md#render)

### required?

> `optional` **required?**: `boolean`

Whether the generated field adds a required validation rule.

#### Inherited from

[`FormItemProps`](FormItemProps.md).[`required`](FormItemProps.md#required)

### rules?

> `optional` **rules?**: `RuleObject`[]

Validation rules forwarded to Ant Design `Form.Item`.

#### Inherited from

[`FormItemProps`](FormItemProps.md).[`rules`](FormItemProps.md#rules)

### tableChildren?

> `optional` **tableChildren?**: [`UnionFaasItemElement`](../type-aliases/UnionFaasItemElement.md)\<`any`\> \| `null`

Table-specific custom element.

#### Inherited from

[`TableItemProps`](TableItemProps.md).[`tableChildren`](TableItemProps.md#tablechildren)

### tableRender?

> `optional` **tableRender?**: [`UnionFaasItemRender`](../type-aliases/UnionFaasItemRender.md)\<`any`\> \| `null`

Table-specific custom render callback.

#### Inherited from

[`TableItemProps`](TableItemProps.md).[`tableRender`](TableItemProps.md#tablerender)

### title?

> `optional` **title?**: `string`

Human-readable title used for labels and table headers.

#### Inherited from

[`FormItemProps`](FormItemProps.md).[`title`](FormItemProps.md#title)

### type?

> `optional` **type?**: [`FaasItemType`](../type-aliases/FaasItemType.md)

Built-in FaasJS field type used to choose the default Ant Design input.

#### Default

```ts
'string'
```

#### Inherited from

[`FormItemProps`](FormItemProps.md).[`type`](FormItemProps.md#type)
