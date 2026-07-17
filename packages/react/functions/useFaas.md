[@faasjs/react](../README.md) / useFaas

# Function: useFaas()

> **useFaas**\<`Path`>>>>\>(`action`, `defaultParams`, `options?`): [`FaasDataInjection`](../type-aliases/FaasDataInjection.md)\<`Path`>>>>\>

Request FaasJS data and keep request state in React state.

`useFaas` is the default hook for standard FaasJS request-response flows in React.
It sends an initial request unless `skip` is enabled, and returns request state
plus helpers for reloading, background refreshing, updating data, and handling errors.

## Type Parameters

### Path

`Path` _extends_ `FaasActionPaths`

Registered action path used to infer params and response data.

## Parameters

### action

`Path`

Action path to invoke.

### defaultParams

`FaasParams`\<`Path`\>

Params used for the initial request and future reloads.

### options?

[`UseFaasOptions`](../type-aliases/UseFaasOptions.md)\<`Path`\> = `{}`

Optional hook configuration such as controlled data, skip logic, debounce timing, polling, and base URL overrides.
See the `UseFaasOptions` type for `params`, `data`, `setData`, `skip`, `debounce`, `polling`, and `baseUrl`.

## Returns

[`FaasDataInjection`](../type-aliases/FaasDataInjection.md)\<`Path`\>

Request state and helper methods described by [FaasDataInjection](../type-aliases/FaasDataInjection.md).

## Example

```tsx
import { useFaas } from '@faasjs/react'

declare module '@faasjs/types' {
  interface FaasActions {
    'features/users/api/get': {
      Params: { id: number }
      Data: { name: string }
    }
  }
}

type GetUserAction = 'features/users/api/get'

function Profile({ id }: { id: number }) {
  const { data, error, loading, reload } = useFaas<GetUserAction>('features/users/api/get', { id })

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
