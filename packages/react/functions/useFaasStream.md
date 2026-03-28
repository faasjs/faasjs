[@faasjs/react](../README.md) / useFaasStream

# Function: useFaasStream()

> **useFaasStream**(`action`, `defaultParams`, `options?`): [`UseFaasStreamResult`](../type-aliases/UseFaasStreamResult.md)

Stream a FaasJS response into React state.

The hook sends a streaming request, appends decoded text chunks to `data`,
and exposes reload helpers for retrying the same action.

## Parameters

### action

`string`

Action path to invoke.

### defaultParams

`Record`\<`string`, `any`\>

Params used for the initial request and future reloads.

### options?

[`UseFaasStreamOptions`](../type-aliases/UseFaasStreamOptions.md) = `{}`

Optional hook configuration such as controlled data, debounce, and skip logic.

## Returns

[`UseFaasStreamResult`](../type-aliases/UseFaasStreamResult.md)

Streaming request state and helper methods described by [UseFaasStreamResult](../type-aliases/UseFaasStreamResult.md).

## Example

```tsx
import { useState } from 'react'
import { useFaasStream } from '@faasjs/react'

function Chat() {
  const [prompt, setPrompt] = useState('')
  const { data, loading, reload } = useFaasStream('chat', { prompt })

  return (
    <div>
      <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} />
      <button onClick={reload} disabled={loading}>
        Send
      </button>
      <div>{data}</div>
    </div>
  )
}
```
