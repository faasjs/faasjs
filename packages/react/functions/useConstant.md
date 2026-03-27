[@faasjs/react](../README.md) / useConstant

# Function: useConstant()

> **useConstant**\<`T`\>(`fn`): `T`

Returns a constant value that is created by the given function.

## Type Parameters

### T

`T`

## Parameters

### fn

() => `T`

## Returns

`T`

## Example

```tsx
import { useConstant } from '@faasjs/react'

function Page() {
  const requestId = useConstant(() => crypto.randomUUID())

  return <span>{requestId}</span>
}
```
