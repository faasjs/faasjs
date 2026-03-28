[@faasjs/react](../README.md) / usePrevious

# Function: usePrevious()

> **usePrevious**\<`T`\>(`value`): `T` \| `undefined`

Hook to store the previous value of a state or prop.

## Type Parameters

### T

`T` = `any`

The type of the value.

## Parameters

### value

`T`

The current value to track.

## Returns

`T` \| `undefined`

Previous value from the prior render, or `undefined` on the first render.

## Example

```tsx
import { usePrevious } from '@faasjs/react'

function Counter({ count }: { count: number }) {
  const previous = usePrevious(count)

  return <span>{previous} -> {count}</span>
}
```
