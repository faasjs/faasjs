[@faasjs/ant-design](../README.md) / useFaas

# Function: useFaas()

> **useFaas**\<`PathOrData`\>(`action`, `defaultParams`, `options`?): `FaasDataInjection`\<`FaasData`\<`PathOrData`\>\>

Request faas server with React hook

## Type parameters

• **PathOrData** extends `Record`\<`string`, `any`\>

## Parameters

• **action**: `string` \| `PathOrData`

\{string\} action name

• **defaultParams**: `FaasParams`\<`PathOrData`\>

\{object\} initial action params

• **options?**: `useFaasOptions`\<`PathOrData`\>

## Returns

`FaasDataInjection`\<`FaasData`\<`PathOrData`\>\>

## Example

```tsx
function Post ({ id }) {
  const { data } = useFaas<{ title: string }>('post/get', { id })
  return <h1>{data.title}</h1>
}
```
