[@faasjs/ant-design](../README.md) / Blank

# Function: Blank()

> **Blank**(`options`?): `JSX.Element`

Blank component.

If value is undefined or null, return text, otherwise return value.

## Parameters

• **options?**: [`BlankProps`](../interfaces/BlankProps.md)

## Returns

`JSX.Element`

## Example

```tsx
import { Blank } from '@faasjs/ant-design'

<Blank value={undefined} text="Empty" />
```
