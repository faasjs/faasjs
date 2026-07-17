[@faasjs/react](../README.md) / useFaasStream

# Function: useFaasStream()

> **useFaasStream**\<`Path`>>>>\>(`action`, `defaultParams`, `options?`): [`UseFaasStreamResult`](../type-aliases/UseFaasStreamResult.md)\<`Path`>>>>\>

Stream a FaasJS response into React state.

`useFaasStream` is the default hook for streaming FaasJS responses in React.
It sends a streaming request, appends decoded text chunks to `data`, and
exposes reload helpers for retrying the same action.

## Type Parameters

### Path

`Path` _extends_ `FaasActionPaths`

## Parameters

### action

`Path`

Action path to invoke.

### defaultParams

`FaasParams`\<`Path`\>

Params used for the initial request and future reloads.

### options?

[`UseFaasStreamOptions`](../type-aliases/UseFaasStreamOptions.md) = `{}`

Optional hook configuration such as controlled stream text, skip logic, debounce timing, polling, and base URL overrides.
See the `UseFaasStreamOptions` type for `params`, `data`, `setData`, `skip`, `debounce`, `polling`, and `baseUrl`.

## Returns

[`UseFaasStreamResult`](../type-aliases/UseFaasStreamResult.md)\<`Path`\>

Streaming request state and helper methods described by [UseFaasStreamResult](../type-aliases/UseFaasStreamResult.md).

## Example

```tsx
import { useFaasStream } from '@faasjs/react'

declare module '@faasjs/types' {
  interface FaasActions {
    'features/chat/api/stream': {
      Params: { prompt: string }
      Data: string
    }
  }
}

type ChatStreamAction = 'features/chat/api/stream'

function Chat({ prompt }: { prompt: string }) {
  const { data, error, loading, reload } = useFaasStream<ChatStreamAction>(
    'features/chat/api/stream',
    { prompt },
  )

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
