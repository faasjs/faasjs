[@faasjs/react](../README.md) / useFaasStream

# Function: useFaasStream()

> **useFaasStream**(`action`, `defaultParams`, `options?`): [`UseFaasStreamResult`](../type-aliases/UseFaasStreamResult.md)

Stream faas server response with React hook

## Parameters

### action

`string`

{string} action name

### defaultParams

`Record`\<`string`, `any`\>

{object} initial action params

### options?

[`UseFaasStreamOptions`](../type-aliases/UseFaasStreamOptions.md) = `{}`

## Returns

[`UseFaasStreamResult`](../type-aliases/UseFaasStreamResult.md)

## Example

```tsx
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
