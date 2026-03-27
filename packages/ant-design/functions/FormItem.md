[@faasjs/ant-design](../README.md) / FormItem

# Function: FormItem()

> **FormItem**\<`T`\>(`props`): `Element` \| `null`

FormItem

- Based on [Ant Design Form.Item](https://ant.design/components/form#formitem).
- Can be used without [Form](https://faasjs.com/doc/ant-design/#form).

## Type Parameters

### T

`T` = `any`

Value type rendered or edited by the form item.

## Parameters

### props

[`FormItemProps`](../interfaces/FormItemProps.md)\<`T`\>

Form item props including field metadata, rules, and custom renderers.

## Returns

`Element` \| `null`

## Example

```tsx
// use inline type
<FormItem type='string' id='name' />

// use custom type
<FormItem id='password'>
  <Input.Password />
</>
```
