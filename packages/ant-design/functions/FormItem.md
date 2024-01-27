[@faasjs/ant-design](../README.md) / FormItem

# Function: FormItem()

> **FormItem**\<`T`\>(`props`): `Element`

FormItem

- Based on [Ant Design Form.Item](https://ant.design/components/form#formitem).
- Can be used without [Form](https://faasjs.com/doc/ant-design/#form).

## Type parameters

• **T** = `any`

## Parameters

• **props**: [`FormItemProps`](../interfaces/FormItemProps.md)\<`T`\>

## Returns

`Element`

## Example

```tsx
// use inline type
<FormItem type='string' id='name' />

// use custom type
<FormItem id='password'>
  <Input.Password />
</>
```
