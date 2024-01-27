[@faasjs/react](../README.md) / FaasDataWrapper

# Function: FaasDataWrapper()

> **FaasDataWrapper**\<`PathOrData`\>(`props`): `JSX.Element`

A data wrapper for react components

## Type parameters

• **PathOrData** extends `Record`\<`string`, `any`\>

## Parameters

• **props**: [`FaasDataWrapperProps`](../type-aliases/FaasDataWrapperProps.md)\<`PathOrData`\>

## Returns

`JSX.Element`

## Example

```tsx
<FaasDataWrapper<{
  id: string
  title: string
}>
  action='post/get'
  params={ { id: 1 } }
  render={ ({ data }) => <h1>{ data.title }</h1> }
/>
```
