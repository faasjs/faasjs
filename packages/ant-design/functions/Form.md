[@faasjs/ant-design](../README.md) / Form

# Function: Form()

> **Form**\<`Values`\>(`props`): `Element` \| `null`

Form component with Ant Design & FaasJS

- Based on [Ant Design Form](https://ant.design/components/form/).
- Use `onFinish` for custom submit logic.
- Use `faas` for the built-in FaasJS submit flow.

## Type Parameters

### Values

`Values` _extends_ `Record`\<`string`, `any`\> = `any`

## Parameters

### props

[`FormProps`](../type-aliases/FormProps.md)\<`Values`\>

## Returns

`Element` \| `null`

## Examples

```tsx
import { Form } from '@faasjs/ant-design'

export function ProfileForm() {
  return (
    <Form
      items={[
        { id: 'name', required: true },
        { id: 'email', required: true },
      ]}
      onFinish={async (values) => {
        console.log(values)
      }}
    />
  )
}
```

```tsx
import { Form } from '@faasjs/ant-design'

export function CreateUserForm() {
  return (
    <Form
      initialValues={{ role: 'user' }}
      items={[
        { id: 'name', required: true },
        { id: 'role', options: ['user', 'admin'] },
      ]}
      faas={{
        action: 'user/create',
        params: (values) => ({
          role: values.role || 'user',
        }),
      }}
    />
  )
}
```
