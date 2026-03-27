[@faasjs/react](../README.md) / useEqualMemoize

# Function: useEqualMemoize()

> **useEqualMemoize**(`value`): `any`

Custom hook that memoizes a value using deep equality comparison.

## Parameters

### value

`any`

The value to be memoized.

## Returns

`any`

The memoized value.

## Example

```tsx
import { useEqualMemoize } from '@faasjs/react'

function Filters({ filters }: { filters: Record<string, any> }) {
  const memoizedFilters = useEqualMemoize(filters)

  return <pre>{JSON.stringify(memoizedFilters)}</pre>
}
```
