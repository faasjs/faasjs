[@faasjs/react](../README.md) / useFaas

# Function: useFaas()

> **useFaas**\<`PathOrData`\>(`action`, `defaultParams`, `options?`): [`FaasDataInjection`](../type-aliases/FaasDataInjection.md)\<`PathOrData`\>

Request FaasJS data and keep request state in React state.

`useFaas` sends an initial request unless `skip` is enabled, and returns
request state plus helpers for reloading, updating data, and handling errors.

## Type Parameters

### PathOrData

`PathOrData` _extends_ [`FaasActionUnionType`](../type-aliases/FaasActionUnionType.md)

Action path or response data type used for inference.

## Parameters

### action

[`FaasAction`](../type-aliases/FaasAction.md)\<`PathOrData`\>

Action path to invoke.

### defaultParams

[`FaasParams`](../type-aliases/FaasParams.md)\<`PathOrData`\>

Params used for the initial request and future reloads.

### options?

[`useFaasOptions`](../type-aliases/useFaasOptions.md)\<`PathOrData`\> = `{}`

Optional hook configuration such as controlled data, debounce, and skip logic.

## Returns

[`FaasDataInjection`](../type-aliases/FaasDataInjection.md)\<`PathOrData`\>

Request state and helper methods for the action.

## Example

```tsx
import { useFaas } from '@faasjs/react'

function Post({ id }: { id: number }) {
  const { data } = useFaas<{ title: string }>('post/get', { id })

  return <h1>{data.title}</h1>
}
```
