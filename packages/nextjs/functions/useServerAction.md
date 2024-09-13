[@faasjs/nextjs](../README.md) / useServerAction

# Function: useServerAction()

> **useServerAction**\<`TAction`\>(`action`, `params`?): `object`

Hook to call a server action and handle loading and error states

## Type Parameters

• **TAction** *extends* (...`args`) => `Promise`\<`object`\> = `any`

## Parameters

• **action**: `TAction`

• **params?**: `Parameters`\<`TAction`\>

## Returns

`object`

### data

> **data**: `Awaited`\<`ReturnType`\<`TAction`\>\>

### error

> **error**: `Error`

### loading

> **loading**: `boolean`

## Example

```tsx
import { useServerAction } from '@faasjs/nextjs/client'
import { fetchData } from './fetchData'

function Example() {
  const { data, error, loading } = useServerAction(fetchData, { id: 1 })

  if (loading) return <div>Loading...</div>

  if (error) return <div>Error: {error.message}</div>

  return <div>Data: {data}</div>
}
```
