[@faasjs/react](../README.md) / useFaasStream

# Function: useFaasStream()

> **useFaasStream**(`action`, `defaultParams`, `options?`): [`UseFaasStreamResult`](../type-aliases/UseFaasStreamResult.md)

Stream a FaasJS response into React state.

`useFaasStream` is the default hook for streaming FaasJS responses in React.
It sends a streaming request, appends decoded text chunks to `data`, and
exposes reload helpers for retrying the same action.

## Parameters

### action

`string`

Action path to invoke.

### defaultParams

`Record`\<`string`, `any`\>

Params used for the initial request and future reloads.

### options?

[`UseFaasStreamOptions`](../type-aliases/UseFaasStreamOptions.md) = `{}`

Optional hook configuration such as controlled stream text, skip logic, debounce timing, and base URL overrides.
See the `UseFaasStreamOptions` type for `params`, `data`, `setData`, `skip`, `debounce`, and `baseUrl`.

## Returns

[`UseFaasStreamResult`](../type-aliases/UseFaasStreamResult.md)

Streaming request state and helper methods described by [UseFaasStreamResult](../type-aliases/UseFaasStreamResult.md).

## Example

```tsx
import { useFaasStream } from '@faasjs/react'

function Chat({ prompt }: { prompt: string }) {
  const { data, error, loading, reload } = useFaasStream('/pages/chat/stream', { prompt })

  if (loading) return <div>Streaming...</div>

  if (error) {
    return (
      <div>
        <div>Stream failed: {error.message}</div>
        <button type="button" onClick={() => reload()}>
          Retry
        </button>
      </div>
    )
  }

  return <pre>{data}</pre>
}
```
