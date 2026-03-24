[@faasjs/react](../README.md) / Form

# Function: Form()

> **Form**\<`Values`, `FormElements`, `Rules`\>(`props`): `Element`

Render a form with context, default elements, and validation state.

`FormContainer` merges provided elements, language strings, and rules with
the package defaults, then exposes them through form context.

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

Form items and optional overrides for defaults, language, rules, and submit behavior.

## Returns

`Element`

React form container with shared form context.

## Example

```tsx
import { Form } from '@faasjs/react'

function MyForm() {
  return <Form items={[{ name: 'name' }]} />
}
```
