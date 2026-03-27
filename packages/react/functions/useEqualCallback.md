[@faasjs/react](../README.md) / useEqualCallback

# Function: useEqualCallback()

> **useEqualCallback**\<`T`\>(`callback`, `dependencies`): `T`

Custom hook that works like `useCallback` but uses deep comparison on dependencies.

## Type Parameters

### T

`T` _extends_ (...`args`) => `any`

Callback signature to memoize.

## Parameters

### callback

`T`

The callback function to run.

### dependencies

`any`[]

The list of dependencies.

## Returns

`T`

The result of the `useCallback` hook with memoized dependencies.

## Example

```tsx
import { useEqualCallback } from '@faasjs/react'

function Search({ filters }: { filters: Record<string, any> }) {
  const handleSubmit = useEqualCallback(() => {
    console.log(filters)
  }, [filters])

  return <button onClick={handleSubmit}>Search</button>
}
```
