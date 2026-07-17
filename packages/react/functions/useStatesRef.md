[@faasjs/react](../README.md) / useStatesRef

# Function: useStatesRef()

> **useStatesRef**\<`T`>>>>\>(`initialStates`): [`StatesWithSettersAndRefs`](../type-aliases/StatesWithSettersAndRefs.md)\<`T`>>>>\>

Create local state entries, matching setters, and refs for each key in an object.

## Type Parameters

### T

`T` _extends_ `Record`\<`string`, `unknown`\>

A generic type that extends a record with string keys and any values.

## Parameters

### initialStates

`T`

Object whose keys become state values, `setXxx` setters, and `xxxRef` refs.

## Returns

[`StatesWithSettersAndRefs`](../type-aliases/StatesWithSettersAndRefs.md)\<`T`\>

Object containing the original keys plus generated setter functions and refs.

## Example

```tsx
function Counter() {
  const { count, setCount, countRef } = useStatesRef({ count: 0 })

  return <button onClick={() => setCount(countRef.current + 1)}>{count}</button>
}
```
