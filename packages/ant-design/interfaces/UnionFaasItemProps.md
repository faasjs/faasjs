[@faasjs/ant-design](../README.md) / UnionFaasItemProps

# Interface: UnionFaasItemProps\<Value, Values\>

Interface representing the properties of a UnionFaas item.

The UnionFaas item can be used in a form, description, or table.

### Render Priority Order

1. **Null Rendering**
   1. Returns `null` if specific children props are null:
       - `formChildren` / `descriptionChildren` / `tableChildren`
   2. Returns `null` if `children` prop is null
2. **Children Rendering**
   1. First priority: Component-specific children
       - `formChildren` for Form
       - `descriptionChildren` for Description
       - `tableChildren` for Table
   2. Second priority: Generic `children` prop
3. **Custom Render Functions**
   1. First priority: Component-specific render functions
       - `formRender` for Form
       - `descriptionRender` for Description
       - `tableRender` for Table
   2. Second priority: Generic `render` prop
4. **Extended Types**
   - Renders based on registered extended type handlers
5. **Default Rendering**
   - Renders primitive types (string, number, etc.)
   - Uses default formatting based on data type

## Example

```tsx
import { type UnionFaasItemProps, Form, Table, Description } from '@faasjs/ant-design'

const item: UnionFaasItemProps[] = [
  {
    id: 'id',
    formChildren: null, // Don't show in form, only in description and table
  },
  {
    id: 'name',
    required: true, // Required in form
  },
  {
    id: 'age',
    type: 'number', // Number type in form, description and table
    options: ['< 18', '>= 18'], // Options in form and table
  }
]

const data = {
  id: '1',
  name: 'John',
  age: '>= 18',
}

function App() {
  return <>
    <Form items={item} /> // Use in form
    <Description items={item} dataSource={data} /> // Use in description
    <Table items={item} dataSource={[ data ]} /> // Use in table
  </>
}
```

## Extends

- [`FormItemProps`](FormItemProps.md).[`DescriptionItemProps`](DescriptionItemProps.md).[`TableItemProps`](TableItemProps.md)

## Type Parameters

• **Value** = `any`

• **Values** = `any`

## Properties

### children?

> `optional` **children**: [`UnionFaasItemElement`](../type-aliases/UnionFaasItemElement.md)\<[`UnionFaasItemProps`](UnionFaasItemProps.md)\<`Value`, `Values`\>, `any`\>

#### Overrides

[`TableItemProps`](TableItemProps.md).[`children`](TableItemProps.md#children)

### col?

> `optional` **col**: `number`

#### Inherited from

[`FormItemProps`](FormItemProps.md).[`col`](FormItemProps.md#col)

### descriptionChildren?

> `optional` **descriptionChildren**: [`UnionFaasItemElement`](../type-aliases/UnionFaasItemElement.md)\<`any`\>

#### Inherited from

[`DescriptionItemProps`](DescriptionItemProps.md).[`descriptionChildren`](DescriptionItemProps.md#descriptionchildren)

### descriptionRender?

> `optional` **descriptionRender**: [`UnionFaasItemRender`](../type-aliases/UnionFaasItemRender.md)\<`any`\>

#### Inherited from

[`DescriptionItemProps`](DescriptionItemProps.md).[`descriptionRender`](DescriptionItemProps.md#descriptionrender)

### disabled?

> `optional` **disabled**: `boolean`

#### Inherited from

[`FormItemProps`](FormItemProps.md).[`disabled`](FormItemProps.md#disabled)

### extendTypes?

> `optional` **extendTypes**: [`ExtendTypes`](../type-aliases/ExtendTypes.md)

#### Inherited from

[`FormItemProps`](FormItemProps.md).[`extendTypes`](FormItemProps.md#extendtypes)

### formChildren?

> `optional` **formChildren**: [`UnionFaasItemElement`](../type-aliases/UnionFaasItemElement.md)\<`any`\>

#### Inherited from

[`FormItemProps`](FormItemProps.md).[`formChildren`](FormItemProps.md#formchildren)

### formRender?

> `optional` **formRender**: [`UnionFaasItemRender`](../type-aliases/UnionFaasItemRender.md)\<`any`\>

#### Inherited from

[`FormItemProps`](FormItemProps.md).[`formRender`](FormItemProps.md#formrender)

### id

> **id**: `string`

#### Inherited from

[`TableItemProps`](TableItemProps.md).[`id`](TableItemProps.md#id)

### if()?

> `optional` **if**: (`values`) => `boolean`

trigger when any item's value changed

#### Parameters

##### values

`Record`\<`string`, `any`\>

#### Returns

`boolean`

#### Inherited from

[`DescriptionItemProps`](DescriptionItemProps.md).[`if`](DescriptionItemProps.md#if)

### input?

> `optional` **input**: `SelectProps` \| `InputProps` \| `RadioProps` \| `InputNumberProps` \| `SwitchProps` \| `DatePickerProps`

#### Inherited from

[`FormItemProps`](FormItemProps.md).[`input`](FormItemProps.md#input)

### label?

> `optional` **label**: `string` \| `false`

#### Inherited from

[`FormItemProps`](FormItemProps.md).[`label`](FormItemProps.md#label)

### maxCount?

> `optional` **maxCount**: `number`

#### Inherited from

[`FormItemProps`](FormItemProps.md).[`maxCount`](FormItemProps.md#maxcount)

### object?

> `optional` **object**: [`UnionFaasItemProps`](UnionFaasItemProps.md)\<`Value`, `Values`\>[]

#### Overrides

[`TableItemProps`](TableItemProps.md).[`object`](TableItemProps.md#object)

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

[`FormItemProps`](FormItemProps.md).[`onValueChange`](FormItemProps.md#onvaluechange)

### options?

> `optional` **options**: [`BaseOption`](../type-aliases/BaseOption.md)[]

#### Inherited from

[`TableItemProps`](TableItemProps.md).[`options`](TableItemProps.md#options)

### optionsType?

> `optional` **optionsType**: `"auto"`

#### Inherited from

[`TableItemProps`](TableItemProps.md).[`optionsType`](TableItemProps.md#optionstype)

### render?

> `optional` **render**: [`UnionFaasItemRender`](../type-aliases/UnionFaasItemRender.md)\<`Value`, `Values`\>

#### Overrides

[`TableItemProps`](TableItemProps.md).[`render`](TableItemProps.md#render)

### required?

> `optional` **required**: `boolean`

#### Inherited from

[`FormItemProps`](FormItemProps.md).[`required`](FormItemProps.md#required)

### rules?

> `optional` **rules**: `RuleObject`[]

#### Inherited from

[`FormItemProps`](FormItemProps.md).[`rules`](FormItemProps.md#rules)

### tableChildren?

> `optional` **tableChildren**: [`UnionFaasItemElement`](../type-aliases/UnionFaasItemElement.md)\<`any`\>

#### Inherited from

[`TableItemProps`](TableItemProps.md).[`tableChildren`](TableItemProps.md#tablechildren)

### tableRender?

> `optional` **tableRender**: [`UnionFaasItemRender`](../type-aliases/UnionFaasItemRender.md)\<`any`\>

#### Inherited from

[`TableItemProps`](TableItemProps.md).[`tableRender`](TableItemProps.md#tablerender)

### title?

> `optional` **title**: `string`

#### Inherited from

[`TableItemProps`](TableItemProps.md).[`title`](TableItemProps.md#title)

### type?

> `optional` **type**: [`FaasItemType`](../type-aliases/FaasItemType.md)

Support string, string[], number, number[], boolean, date, time, object, object[]

#### Default

```ts
'string'
```

#### Inherited from

[`TableItemProps`](TableItemProps.md).[`type`](TableItemProps.md#type)
