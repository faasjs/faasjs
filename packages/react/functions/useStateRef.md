[@faasjs/react](../README.md) / useStateRef

# Function: useStateRef()

## Call Signature

> **useStateRef**\<`T`\>(`initialValue?`): \[`T`, `Dispatch`\<`SetStateAction`\<`T`\>\>, `RefObject`\<`T`\>\]

Custom hook that returns a stateful value and a ref to that value.

### Type Parameters

#### T

`T`

The type of the value.

### Parameters

#### initialValue?

`T` \| (() => `T`)

Initial state value. Defaults to `undefined`.

### Returns

\[`T`, `Dispatch`\<`SetStateAction`\<`T`\>\>, `RefObject`\<`T`\>\]

Tuple containing the current state, the state setter, and a ref that always points at the latest state.

### Example

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
}
```

## Call Signature

> **useStateRef**\<`T`\>(): \[`T` \| `undefined`, `Dispatch`\<`SetStateAction`\<`T` \| `undefined`\>\>, `RefObject`\<`T` \| `undefined`\>\]

Custom hook that returns a stateful value and a ref to that value.

### Type Parameters

#### T

`T` = `undefined`

The type of the value.

### Returns

\[`T` \| `undefined`, `Dispatch`\<`SetStateAction`\<`T` \| `undefined`\>\>, `RefObject`\<`T` \| `undefined`\>\]

Tuple containing the current state, the state setter, and a ref that always points at the latest state.

### Example

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
}
```
