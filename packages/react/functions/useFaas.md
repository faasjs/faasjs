[@faasjs/react](../README.md) / useFaas

# Function: useFaas()

> **useFaas**\<`PathOrData`\>(`action`, `defaultParams`, `options?`): [`FaasDataInjection`](../type-aliases/FaasDataInjection.md)\<`PathOrData`\>

Request FaasJS data and keep request state in React state.

`useFaas` is the default hook for standard FaasJS request-response flows in React.
It sends an initial request unless `skip` is enabled, and returns request state
plus helpers for reloading, updating data, and handling errors.

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

Optional hook configuration such as controlled data, skip logic, debounce timing, and base URL overrides.
See the `useFaasOptions` type for `params`, `data`, `setData`, `skip`, `debounce`, and `baseUrl`.

## Returns

[`FaasDataInjection`](../type-aliases/FaasDataInjection.md)\<`PathOrData`\>

Request state and helper methods described by [FaasDataInjection](../type-aliases/FaasDataInjection.md).

## Example

```tsx
import { useFaas } from '@faasjs/react'

function Profile({ id }: { id: number }) {
  const { data, error, loading, reload } = useFaas('/pages/users/get', { id })

  if (loading) return <div>Loading...</div>

  if (error) {
    return (
      <div>
        <div>Load failed: {error.message}</div>
        <button type="button" onClick={() => reload()}>
          Retry
        </button>
      </div>
    )
  }

  return (
    <div>
      <span>{data.name}</span>
      <button type="button" onClick={() => reload()}>
        Refresh
      </button>
    </div>
  )
}
```
