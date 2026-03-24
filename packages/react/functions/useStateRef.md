[@faasjs/react](../README.md) / useStateRef

# Function: useStateRef()

> **useStateRef**\<`T`\>(`initialValue?`): \[`T` \| `null`, `Dispatch`\<`SetStateAction`\<`T` \| `null`\>\>, `RefObject`\<`T` \| `null`\>\]

Custom hook that returns a stateful value and a ref to that value.

## Type Parameters

### T

`T` = `any`

The type of the value.

## Parameters

### initialValue?

`T`

The initial value of the state.

## Returns

\[`T` \| `null`, `Dispatch`\<`SetStateAction`\<`T` \| `null`\>\>, `RefObject`\<`T` \| `null`\>\]

- The stateful value, a function to set the value, and a ref to the value.

## Example

```tsx
import { useStateRef } from '@faasjs/react'

function MyComponent() {
 const [value, setValue, ref] = useStateRef(0)

return (
  <div>
    <p>Value: {value}</p>
    <button onClick={() => setValue(value + 1)}>Increment</button>
    <button onClick={() => console.log(ref.current)}>Submit</button>
  </div>
)
```
