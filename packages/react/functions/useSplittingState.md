[@faasjs/react](../README.md) / useSplittingState

# Function: useSplittingState()

> **useSplittingState**\<`T`\>(`initialStates`): [`StatesWithSetters`](../type-aliases/StatesWithSetters.md)\<`T`\>

Create local state entries and matching setters for each key in an object.

## Type Parameters

### T

`T` _extends_ `Record`\<`string`, `unknown`\>

A generic type that extends a record with string keys and any values.

## Parameters

### initialStates

`T`

Object whose keys become state values and `setXxx` setters.

## Returns

[`StatesWithSetters`](../type-aliases/StatesWithSetters.md)\<`T`\>

Object containing the original keys plus generated setter functions.

## Example

```tsx
function Counter() {
  const { count, setCount, name, setName } = useSplittingState({ count: 0, name: 'John' })

  return (
    <>
      {name}: {count}
    </>
  )
}
```
