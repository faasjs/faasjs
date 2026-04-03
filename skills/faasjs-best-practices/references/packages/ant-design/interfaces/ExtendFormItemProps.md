[@faasjs/ant-design](../README.md) / ExtendFormItemProps

# Interface: ExtendFormItemProps

Item shape used to extend `Form` with custom type names.

## Example

```tsx
import { Form, type ExtendFormItemProps, type FormProps } from '@faasjs/ant-design'
import { Input } from 'antd'

interface ExtendTypes extends ExtendFormItemProps {
  type: 'password'
}

function ExtendForm(props: FormProps<any, ExtendTypes>) {
  return <Form {...props} extendTypes={{ password: { children: <Input.Password /> } }} />
}

export function Page() {
  return (
    <ExtendForm
      items={[
        {
          id: 'password',
          type: 'password',
        },
      ]}
    />
  )
}
```

## Extends

- `Omit`\<[`FormItemProps`](FormItemProps.md), `"type"`\>

## Properties

### children?

> `optional` **children?**: [`UnionFaasItemElement`](../type-aliases/UnionFaasItemElement.md)\<`any`\> \| `null`

Generic custom field renderer or element.

#### Inherited from

`Omit.children`

### col?

> `optional` **col?**: `number`

Grid span used by surrounding object-list layouts.

#### Inherited from

[`UnionFaasItemProps`](UnionFaasItemProps.md).[`col`](UnionFaasItemProps.md#col)

### disabled?

> `optional` **disabled?**: `boolean`

Whether the generated field is disabled.

#### Inherited from

[`UnionFaasItemProps`](UnionFaasItemProps.md).[`disabled`](UnionFaasItemProps.md#disabled)

### extendTypes?

> `optional` **extendTypes?**: [`ExtendTypes`](../type-aliases/ExtendTypes.md)

Custom form item type renderers keyed by type name.

#### Inherited from

[`UnionFaasItemProps`](UnionFaasItemProps.md).[`extendTypes`](UnionFaasItemProps.md#extendtypes)

### formChildren?

> `optional` **formChildren?**: [`UnionFaasItemElement`](../type-aliases/UnionFaasItemElement.md)\<`any`\> \| `null`

Form-specific custom field renderer or element.

#### Inherited from

`Omit.formChildren`

### formRender?

> `optional` **formRender?**: [`UnionFaasItemRender`](../type-aliases/UnionFaasItemRender.md)\<`any`\> \| `null`

Form-specific custom render callback.

#### Inherited from

`Omit.formRender`

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

#### Inherited from

`Omit.if`

### input?

> `optional` **input?**: `InputProps` \| `SelectProps`\<`any`, `DefaultOptionType`\> \| `RadioProps` \| `InputNumberProps`\<`ValueType`\> \| `SwitchProps` \| `DatePickerProps`

Input props forwarded to the generated Ant Design control.

#### Inherited from

`Omit.input`

### label?

> `optional` **label?**: `string` \| `false`

Label override, or `false` to hide the label completely.

#### Inherited from

[`UnionFaasItemProps`](UnionFaasItemProps.md).[`label`](UnionFaasItemProps.md#label)

### maxCount?

> `optional` **maxCount?**: `number`

Maximum item count allowed for list-style field types.

#### Inherited from

[`UnionFaasItemProps`](UnionFaasItemProps.md).[`maxCount`](UnionFaasItemProps.md#maxcount)

### object?

> `optional` **object?**: [`FormItemProps`](FormItemProps.md)\<`any`\>[]

Nested field definitions used by `object` and `object[]` item types.

#### Inherited from

`Omit.object`

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

`Omit.onValueChange`

### options?

> `optional` **options?**: [`BaseOption`](../type-aliases/BaseOption.md)[]

Shared choice options used by select-like renderers.

#### Inherited from

[`BaseItemProps`](BaseItemProps.md).[`options`](BaseItemProps.md#options)

### render?

> `optional` **render?**: [`UnionFaasItemRender`](../type-aliases/UnionFaasItemRender.md)\<`any`\> \| `null`

Generic custom render callback.

#### Inherited from

`Omit.render`

### required?

> `optional` **required?**: `boolean`

Whether the generated field adds a required validation rule.

#### Inherited from

[`UnionFaasItemProps`](UnionFaasItemProps.md).[`required`](UnionFaasItemProps.md#required)

### rules?

> `optional` **rules?**: `RuleObject`[]

Validation rules forwarded to Ant Design `Form.Item`.

#### Inherited from

[`UnionFaasItemProps`](UnionFaasItemProps.md).[`rules`](UnionFaasItemProps.md#rules)

### title?

> `optional` **title?**: `string`

Human-readable title used for labels and table headers.

#### Inherited from

[`BaseItemProps`](BaseItemProps.md).[`title`](BaseItemProps.md#title)

### type?

> `optional` **type?**: `string`
