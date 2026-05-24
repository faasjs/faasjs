[@faasjs/ant-design](../README.md) / FormWithFaasProps

# Type Alias: FormWithFaasProps\<Path, Values, ExtendItemProps\>

> **FormWithFaasProps**\<`Path`, `Values`, `ExtendItemProps`\> = `FormCommonProps`\<`Values`, `ExtendItemProps`\> & `object`

Props for [Form](../functions/Form.md) when used with the built-in FaasJS submit handler.

## Type Declaration

### faas?

> `optional` **faas?**: [`FormFaasProps`](FormFaasProps.md)\<`Values`, `Path`\>

Built-in FaasJS submit handler, ignored when `onFinish` is provided.

### onFinish?

> `optional` **onFinish?**: `never`

## Type Parameters

### Path

`Path` _extends_ `FaasActionPaths` = `any`

Action path type for strong typing of `action` and `params`.

### Values

`Values` _extends_ `Record`\<`string`, `any`\> = `any`

Form values shape.

### ExtendItemProps

`ExtendItemProps` _extends_ [`ExtendFormItemProps`](../interfaces/ExtendFormItemProps.md) = [`ExtendFormItemProps`](../interfaces/ExtendFormItemProps.md)

Additional item prop shape accepted by `items`.

## Example

```tsx
import { Form, type FormWithFaasProps } from '@faasjs/ant-design'

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
