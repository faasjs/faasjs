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

[`UnionFaasItemProps`](UnionFaasItemProps.md).[`col`](UnionFaasItemProps.md#col)

### disabled?

> `optional` **disabled**: `boolean`

#### Inherited from

[`UnionFaasItemProps`](UnionFaasItemProps.md).[`disabled`](UnionFaasItemProps.md#disabled)

### extendTypes?

> `optional` **extendTypes**: [`ExtendTypes`](../type-aliases/ExtendTypes.md)

#### Inherited from

[`UnionFaasItemProps`](UnionFaasItemProps.md).[`extendTypes`](UnionFaasItemProps.md#extendtypes)

### formChildren?

> `optional` **formChildren**: [`UnionFaasItemElement`](../type-aliases/UnionFaasItemElement.md)\<`any`\>

#### Inherited from

`Omit.formChildren`

### formRender?

> `optional` **formRender**: [`UnionFaasItemRender`](../type-aliases/UnionFaasItemRender.md)\<`any`\>

#### Inherited from

`Omit.formRender`

### id

> **id**: `string` \| `number`

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

#### Inherited from

`Omit.if`

### input?

> `optional` **input**: `SelectProps`\<`any`, `DefaultOptionType`\> \| `InputProps` \| `RadioProps` \| `InputNumberProps`\<`ValueType`\> \| `SwitchProps` \| `DatePickerProps`

#### Inherited from

`Omit.input`

### label?

> `optional` **label**: `string` \| `false`

#### Inherited from

[`UnionFaasItemProps`](UnionFaasItemProps.md).[`label`](UnionFaasItemProps.md#label)

### maxCount?

> `optional` **maxCount**: `number`

#### Inherited from

[`UnionFaasItemProps`](UnionFaasItemProps.md).[`maxCount`](UnionFaasItemProps.md#maxcount)

### object?

> `optional` **object**: [`FormItemProps`](FormItemProps.md)\<`any`\>[]

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

[`BaseItemProps`](BaseItemProps.md).[`options`](BaseItemProps.md#options)

### render?

> `optional` **render**: [`UnionFaasItemRender`](../type-aliases/UnionFaasItemRender.md)\<`any`\>

#### Inherited from

`Omit.render`

### required?

> `optional` **required**: `boolean`

#### Inherited from

[`UnionFaasItemProps`](UnionFaasItemProps.md).[`required`](UnionFaasItemProps.md#required)

### rules?

> `optional` **rules**: `RuleObject`[]

#### Inherited from

[`UnionFaasItemProps`](UnionFaasItemProps.md).[`rules`](UnionFaasItemProps.md#rules)

### title?

> `optional` **title**: `string`

#### Inherited from

[`BaseItemProps`](BaseItemProps.md).[`title`](BaseItemProps.md#title)

### type?

> `optional` **type**: `string`
