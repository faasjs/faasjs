[@faasjs/react](../README.md) / useFaas

# Function: useFaas()

> **useFaas**\<`PathOrData`\>(`action`, `defaultParams`, `options`): [`FaasDataInjection`](../type-aliases/FaasDataInjection.md)\<`PathOrData`\>

Request faas server with React hook

## Type Parameters

• **PathOrData** *extends* [`FaasAction`](../type-aliases/FaasAction.md)

## Parameters

### action

{string} action name

`string` | `PathOrData`

### defaultParams

[`FaasParams`](../type-aliases/FaasParams.md)\<`PathOrData`\>

{object} initial action params

### options

[`useFaasOptions`](../type-aliases/useFaasOptions.md)\<`PathOrData`\> = `{}`

## Returns

[`FaasDataInjection`](../type-aliases/FaasDataInjection.md)\<`PathOrData`\>

## Example

```tsx
function Post ({ id }) {
  const { data } = useFaas<{ title: string }>('post/get', { id })
  return <h1>{data.title}</h1>
}
```
