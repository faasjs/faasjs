[@faasjs/react](../README.md) / Form

# Function: Form()

> **Form**\<`Values`, `FormElements`, `Rules`\>(`__namedParameters`): `Element`

FormContainer component is a wrapper that provides context and state management for form elements.
It initializes form states such as values, errors, submitting status, elements, language, and rules.

## Type Parameters

• **Values** *extends* `Record`\<`string`, `any`\> = `Record`\<`string`, `any`\>

The type of form values, defaults to Record<string, any>.

• **FormElements** *extends* [`FormElementTypes`](../type-aliases/FormElementTypes.md) = [`FormElementTypes`](../type-aliases/FormElementTypes.md)

The type of form elements, defaults to FormElementTypes.

• **Rules** *extends* [`FormRules`](../type-aliases/FormRules.md) = [`FormRules`](../type-aliases/FormRules.md)

The type of form rules, defaults to FormDefaultRules.

## Parameters

• **\_\_namedParameters**: [`FormProps`](../type-aliases/FormProps.md)\<`Values`, `FormElements`, `Rules`\>

## Returns

`Element`

The FormContainer component.

## Example

```tsx
import { Form } from '@faasjs/react'

function MyForm() {
  return <Form
    items={[
      { name: 'name' },
    ]}
  />
}
```
