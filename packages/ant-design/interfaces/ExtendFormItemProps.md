[@faasjs/ant-design](../README.md) / ExtendFormItemProps

# Interface: ExtendFormItemProps

Extend custom form item types.

## Example

```ts
import type { ExtendFormItemProps, FormProps } from '@faasjs/ant-design'

// define custom type
interface ExtendTypes extends ExtendFormItemProps {
  type: 'password'
}

// extend form
function ExtendForm(props: FormProps<any, ExtendTypes>) {
  return (
    <Form
      {...props}
      extendTypes={{ password: { children: <Input.Password /> } }}
    />
  )
}

// use custom type
<ExtendForm
  items={[
    {
      id: 'test',
      type: 'password',
    },
  ]}
/>
```

## Extends

- `Omit`\<[`FormItemProps`](FormItemProps.md), `"type"`\>

## Properties

### children?

> `optional` **children**: [`UnionFaasItemElement`](../type-aliases/UnionFaasItemElement.md)\<`any`\>

#### Inherited from

`Omit.children`

### col?

> `optional` **col**: `number`

#### Inherited from

`Omit.col`

### disabled?

> `optional` **disabled**: `boolean`

#### Inherited from

`Omit.disabled`

### extendTypes?

> `optional` **extendTypes**: [`ExtendTypes`](../type-aliases/ExtendTypes.md)

#### Inherited from

`Omit.extendTypes`

### formChildren?

> `optional` **formChildren**: [`UnionFaasItemElement`](../type-aliases/UnionFaasItemElement.md)\<`any`\>

#### Inherited from

`Omit.formChildren`

### formRender?

> `optional` **formRender**: [`UnionFaasItemRender`](../type-aliases/UnionFaasItemRender.md)\<`any`\>

#### Inherited from

`Omit.formRender`

### id

> **id**: `string`

#### Inherited from

`Omit.id`

### if()?

> `optional` **if**: (`values`) => `boolean`

trigger when any item's value changed

#### Parameters

##### values

`Record`\<`string`, `any`\>

#### Returns

`boolean`

#### Inherited from

`Omit.if`

### input?

> `optional` **input**: `SelectProps` \| `InputProps` \| `RadioProps` \| `InputNumberProps` \| `SwitchProps` \| `DatePickerProps`

#### Inherited from

`Omit.input`

### label?

> `optional` **label**: `string` \| `false`

#### Inherited from

`Omit.label`

### maxCount?

> `optional` **maxCount**: `number`

#### Inherited from

`Omit.maxCount`

### object?

> `optional` **object**: [`FormItemProps`](FormItemProps.md)[]

#### Inherited from

`Omit.object`

### onValueChange()?

> `optional` **onValueChange**: (`value`, `values`, `form`) => `void`

trigger when current item's value changed

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

> `optional` **options**: [`BaseOption`](../type-aliases/BaseOption.md)[]

#### Inherited from

`Omit.options`

### render?

> `optional` **render**: [`UnionFaasItemRender`](../type-aliases/UnionFaasItemRender.md)\<`any`\>

#### Inherited from

`Omit.render`

### required?

> `optional` **required**: `boolean`

#### Inherited from

`Omit.required`

### rules?

> `optional` **rules**: `RuleObject`[]

#### Inherited from

`Omit.rules`

### title?

> `optional` **title**: `string`

#### Inherited from

`Omit.title`

### type?

> `optional` **type**: `string`
