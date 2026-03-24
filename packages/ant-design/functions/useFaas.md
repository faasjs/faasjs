[@faasjs/ant-design](../README.md) / useFaas

# Function: useFaas()

> **useFaas**\<`PathOrData`\>(`action`, `defaultParams`, `options?`): `FaasDataInjection`\<`PathOrData`\>

Request faas server with React hook

## Type Parameters

### PathOrData

`PathOrData` _extends_ `FaasActionUnionType`

## Parameters

### action

`FaasAction`\<`PathOrData`\>

{string} action name

### defaultParams

`FaasParams`\<`PathOrData`\>

{object} initial action params

### options?

`useFaasOptions`\<`PathOrData`\> = `{}`

## Returns

`FaasDataInjection`\<`PathOrData`\>

## Example

```tsx
function Post({ id }) {
  const { data } = useFaas<{ title: string }>('post/get', { id })
  return <h1>{data.title}</h1>
}
```
