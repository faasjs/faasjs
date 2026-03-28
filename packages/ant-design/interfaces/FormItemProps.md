[@faasjs/ant-design](../README.md) / FormItemProps

# Interface: FormItemProps\<T\>

Item definition used by the `FormItem` and `Form` components.

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

> `optional` **children?**: [`UnionFaasItemElement`](../type-aliases/UnionFaasItemElement.md)\<`T`\> \| `null`

Generic custom field renderer or element.

### col?

> `optional` **col?**: `number`

Grid span used by surrounding object-list layouts.

### disabled?

> `optional` **disabled?**: `boolean`

Whether the generated field is disabled.

### extendTypes?

> `optional` **extendTypes?**: [`ExtendTypes`](../type-aliases/ExtendTypes.md)

Custom form item type renderers keyed by type name.

### formChildren?

> `optional` **formChildren?**: [`UnionFaasItemElement`](../type-aliases/UnionFaasItemElement.md)\<`T`\> \| `null`

Form-specific custom field renderer or element.

### formRender?

> `optional` **formRender?**: [`UnionFaasItemRender`](../type-aliases/UnionFaasItemRender.md)\<`T`\> \| `null`

Form-specific custom render callback.

### id

> **id**: `string` \| `number`

Stable field identifier used as the default name and title source.

#### Inherited from

[`BaseItemProps`](BaseItemProps.md).[`id`](BaseItemProps.md#id)

### if?

> `optional` **if?**: (`values`) => `boolean`

Predicate used to show or hide the item from the current form values.

#### Parameters

##### values

`Record`\<`string`, `any`\>

#### Returns

`boolean`

### input?

> `optional` **input?**: `InputProps` \| `RadioProps` \| `InputNumberProps`\<`ValueType`\> \| `SwitchProps` \| `DatePickerProps` \| `SelectProps`\<`T`, `DefaultOptionType`\>

Input props forwarded to the generated Ant Design control.

### label?

> `optional` **label?**: `string` \| `false`

Label override, or `false` to hide the label completely.

#### Overrides

`Omit.label`

### maxCount?

> `optional` **maxCount?**: `number`

Maximum item count allowed for list-style field types.

### object?

> `optional` **object?**: `FormItemProps`\<`any`\>[]

Nested field definitions used by `object` and `object[]` item types.

### onValueChange?

> `optional` **onValueChange?**: (`value`, `values`, `form`) => `void`

Callback invoked when this field's value changes.

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

Shared choice options used by select-like renderers.

#### Inherited from

[`BaseItemProps`](BaseItemProps.md).[`options`](BaseItemProps.md#options)

### render?

> `optional` **render?**: [`UnionFaasItemRender`](../type-aliases/UnionFaasItemRender.md)\<`T`\> \| `null`

Generic custom render callback.

### required?

> `optional` **required?**: `boolean`

Whether the generated field adds a required validation rule.

#### Overrides

`Omit.required`

### rules?

> `optional` **rules?**: `RuleObject`[]

Validation rules forwarded to Ant Design `Form.Item`.

#### Overrides

`Omit.rules`

### title?

> `optional` **title?**: `string`

Human-readable title used for labels and table headers.

#### Inherited from

[`BaseItemProps`](BaseItemProps.md).[`title`](BaseItemProps.md#title)

### type?

> `optional` **type?**: [`FaasItemType`](../type-aliases/FaasItemType.md)

Built-in FaasJS field type used to choose the default Ant Design input.

#### Default

```ts
'string'
```
