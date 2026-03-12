[@faasjs/react](../README.md) / Form

# Function: Form()

> **Form**\<`Values`, `FormElements`, `Rules`\>(`props`): `Element`

FormContainer component is a wrapper that provides context and state management for form elements.
It initializes form states such as values, errors, submitting status, elements, language, and rules.

## Type Parameters

### Values

`Values` _extends_ `Record`\<`string`, `any`\> = `Record`\<`string`, `any`\>

The type of form values, defaults to Record<string, any>.

### FormElements

`FormElements` _extends_ [`FormElementTypes`](../type-aliases/FormElementTypes.md) = [`FormElementTypes`](../type-aliases/FormElementTypes.md)

The type of form elements, defaults to FormElementTypes.

### Rules

`Rules` _extends_ [`FormRules`](../type-aliases/FormRules.md) = [`FormRules`](../type-aliases/FormRules.md)

The type of form rules, defaults to FormDefaultRules.

## Parameters

### props

[`FormProps`](../type-aliases/FormProps.md)\<`Values`, `FormElements`, `Rules`\>

The properties for the FormContainer component.

## Returns

`Element`

The FormContainer component.

## Example

```tsx
import { Form } from '@faasjs/react'

function MyForm() {
  return <Form items={[{ name: 'name' }]} />
}
```
