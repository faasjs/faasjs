[**@faasjs/react**](../README.md)

[@faasjs/react](../README.md) / createProxyStates

# Function: createProxyStates()

> **createProxyStates**\<`T`>>>>>>\>(`defaultStates`): [`ProxyStates`](../type-aliases/ProxyStates.md)\<`T`>>>>>>\>

Create Proxy-backed shared states with generated hooks, setters, and latest-value refs.

Each key receives an independent external store. Components using a generated hook re-render
when the matching setter runs, and code outside React can read the latest value from the
generated ref.

## Type Parameters

### T

`T` _extends_ `Record`\<`string`, `unknown`\>

Shared state object shape.

## Parameters

### defaultStates

`T`

Initial values used to create shared state entries.

## Returns

[`ProxyStates`](../type-aliases/ProxyStates.md)\<`T`\>

Generated `useXxx`, `setXxx`, and `xxxRef` helpers for each key.

## Example

```tsx
import { createProxyStates } from '@faasjs/react'

export const { useText, setText, textRef } = createProxyStates({
  text: '',
})

function Preview() {
  const text = useText()

  return <span>{text}</span>
}

setText('updated')
console.log(textRef.current)
```
