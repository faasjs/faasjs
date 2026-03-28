[@faasjs/react](../README.md) / useEqualMemo

# Function: useEqualMemo()

> **useEqualMemo**\<`T`\>(`callback`, `dependencies`): `T`

Custom hook that works like `useMemo` but uses deep comparison on dependencies.

## Type Parameters

### T

`T`

Memoized value type returned by the callback.

## Parameters

### callback

() => `T`

The callback function to run.

### dependencies

`any`[]

The list of dependencies.

## Returns

`T`

The result of the `useMemo` hook with memoized dependencies.

## Example

```tsx
import { useEqualMemo } from '@faasjs/react'

function Page({ filters }: { filters: Record<string, any> }) {
  const queryString = useEqualMemo(() => JSON.stringify(filters), [filters])

  return <span>{queryString}</span>
}
```
