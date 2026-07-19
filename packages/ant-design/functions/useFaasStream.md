[**@faasjs/ant-design**](../README.md)

[@faasjs/ant-design](../README.md) / useFaasStream

# Function: useFaasStream()

> **useFaasStream**\<`Path`>>>>\>(`action`, `defaultParams`, `options?`): [`UseFaasStreamResult`](../type-aliases/UseFaasStreamResult.md)\<`Path`>>>>\>

Stream a FaasJS response into React state.

In Ant Design apps, import this hook from `@faasjs/ant-design` so streaming failures use the
same configured feedback behavior as other FaasJS requests.

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

[`UseFaasStreamOptions`](../type-aliases/UseFaasStreamOptions.md) = `{}`

Optional stream lifecycle configuration such as skip, debounce, polling, controlled text, or base URL overrides.

## Returns

[`UseFaasStreamResult`](../type-aliases/UseFaasStreamResult.md)\<`Path`\>

Streaming request state and helper methods.

## Example

```tsx
import { useFaasStream } from '@faasjs/ant-design'

export function Chat(props: { prompt: string }) {
  const { data, loading, reload } = useFaasStream('features/chat/api/stream', {
    prompt: props.prompt,
  })

  if (loading) return <div>Streaming...</div>

  return <pre onClick={() => reload()}>{data}</pre>
}
```
