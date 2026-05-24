[@faasjs/ant-design](../README.md) / useFaas

# Function: useFaas()

> **useFaas**\<`Path`\>(`action`, `defaultParams`, `options?`): [`FaasDataInjection`](../type-aliases/FaasDataInjection.md)\<`Path`\>

Request FaasJS data and keep request state in React state.

`useFaas` is the default hook for standard FaasJS request-response flows in React.
It sends an initial request unless `skip` is enabled, and returns request state
plus helpers for reloading, background refreshing, updating data, and handling errors.

## Type Parameters

### Path

`Path` _extends_ `FaasActionPaths`

Action path or response data type used for inference.

## Parameters

### action

`Path`

Action path to invoke.

### defaultParams

`FaasParams`\<`Path`\>

Params used for the initial request and future reloads.

### options?

`UseFaasOptions`\<`Path`\> = `{}`

Optional hook configuration such as controlled data, skip logic, debounce timing, polling, and base URL overrides.
See the `UseFaasOptions` type for `params`, `data`, `setData`, `skip`, `debounce`, `polling`, and `baseUrl`.

## Returns

[`FaasDataInjection`](../type-aliases/FaasDataInjection.md)\<`Path`\>

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
