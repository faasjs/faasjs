[@faasjs/ant-design](../README.md) / FormItem

# Function: FormItem()

> **FormItem**\<`T`\>(`props`): `Element` \| `null`

Render a FaasJS-aware Ant Design form field or nested field group.

The component derives default labels from `id`, applies required validation messages from the
active theme, supports surface-specific union renderers, and can render nested `object` or
`object[]` field structures.

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
import { FormItem } from '@faasjs/ant-design'
import { Input } from 'antd'

export function AccountFields() {
  return (
    <>
      <FormItem id="name" type="string" />
      <FormItem id="password">
        <Input.Password />
      </FormItem>
    </>
  )
}
```
