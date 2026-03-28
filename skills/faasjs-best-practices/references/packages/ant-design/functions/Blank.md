[@faasjs/ant-design](../README.md) / Blank

# Function: Blank()

> **Blank**(`options?`): `Element`

Render a disabled placeholder when a value is empty.

Empty values include `undefined`, `null`, empty strings, and empty arrays.

## Parameters

### options?

[`BlankProps`](../interfaces/BlankProps.md)

Placeholder text and value to render.

## Returns

`Element`

Rendered value or the configured placeholder text.

## Example

```tsx
import { Blank } from '@faasjs/ant-design'

export function FieldPreview() {
  return <Blank value={undefined} text="Empty" />
}
```
