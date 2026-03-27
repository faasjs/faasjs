[@faasjs/react](../README.md) / useConstant

# Function: useConstant()

> **useConstant**\<`T`\>(`fn`): `T`

Returns a constant value that is created by the given function.

## Type Parameters

### T

`T`

Constant value type returned by the initializer.

## Parameters

### fn

() => `T`

Initializer that runs only once for the current component instance.

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
