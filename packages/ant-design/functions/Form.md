[**@faasjs/ant-design**](../README.md)

[@faasjs/ant-design](../README.md) / Form

# Function: Form()

## Call Signature

> **Form**\<`Values`>>>>>>\>(`props`): `Element`

Render a data-aware Ant Design form without the built-in FaasJS submit handler.

The component normalizes `initialValues` with [transferValue](transferValue.md), renders item definitions
through [FormItem](FormItem.md), and delegates submission to the custom `onFinish` handler.

### Type Parameters

#### Values

`Values` _extends_ `Record`\<`string`, `any`\> = `any`

Form values shape.

### Parameters

#### props

[`FormWithoutFaasProps`](../type-aliases/FormWithoutFaasProps.md)\<`Values`\>

Form props including items, submit behavior, and a custom `onFinish` handler.

### Returns

`Element`

### Example

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

## Call Signature

> **Form**\<`Path`, `Values`>>>>>>\>(`props`): `Element`

Render a data-aware Ant Design form with the built-in FaasJS write-action submit handler.

The component normalizes `initialValues` with [transferValue](transferValue.md), renders item definitions
through [FormItem](FormItem.md), and submits via the built-in FaasJS request flow configured by `faas`.
Use this overload for create/update/delete style submissions. For list/read
flows, prefer `Table`, `Description`, `FaasDataWrapper`, or `useFaas`.

When `Path` is provided, the `action` and `params` in `faas` are strongly typed from the
`FaasActions` type augmentation.

### Type Parameters

#### Path

`Path` _extends_ `FaasActionPaths`

Action path type inferred from `faas.action` for strong typing.

#### Values

`Values` _extends_ `Record`\<`string`, `any`\> = `any`

Form values shape.

### Parameters

#### props

[`FormWithFaasProps`](../type-aliases/FormWithFaasProps.md)\<`Path`, `Values`\>

Form props including items, submit behavior, and FaasJS integration.

### Returns

`Element`

### Example

```tsx
import { Form } from '@faasjs/ant-design'

declare module '@faasjs/types' {
  interface FaasActions {
    'user/create': {
      Params: { name: string; role: string }
      Data: { id: number }
    }
  }
}

export function CreateUserForm() {
  return (
    <Form<'user/create', { name: string; role: string }>
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

## Call Signature

> **Form**\<`Values`, `Path`>>>>>>\>(`props`): `Element`

Render a data-aware Ant Design form (catch-all overload for backward compatibility).

### Type Parameters

#### Values

`Values` _extends_ `Record`\<`string`, `any`\> = `any`

#### Path

`Path` _extends_ `FaasActionPaths` = `any`

### Parameters

#### props

[`FormProps`](../type-aliases/FormProps.md)\<`Values`, `Path`\>

### Returns

`Element`
