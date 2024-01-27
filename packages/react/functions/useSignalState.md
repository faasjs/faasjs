[@faasjs/react](../README.md) / useSignalState

# Function: useSignalState()

> **useSignalState**\<`T`\>(`initialValue`, `options`): readonly [`T`, (`changes`) => `void`]

Create a [signal](https://preactjs.com/guide/v10/signals) like useState.

```tsx
import { useSignalState, useSignalEffect } from '@faasjs/react'

function App () {
  const [count, setCount] = useSignalState(0, { debugName: 'count' })

  useSignalEffect(() => console.log('count', count))

  return <div>
    <button onClick={() => setCount(count + 1)}>+</button>
    <span>{count}</span>
  </div>
}
```

## Type parameters

• **T** = `any`

## Parameters

• **initialValue**: `T`

• **options**: [`SignalOptions`](../type-aliases/SignalOptions.md)= `{}`

## Returns

readonly [`T`, (`changes`) => `void`]
