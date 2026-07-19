[**@faasjs/ant-design**](../README.md)

[@faasjs/ant-design](../README.md) / useFaas

# Function: useFaas()

> **useFaas**\<`Path`>>>>\>(`action`, `defaultParams`, `options?`): [`FaasDataInjection`](../type-aliases/FaasDataInjection.md)\<`Path`>>>>\>

Request FaasJS data and keep request state in React state.

In Ant Design apps, import this hook from `@faasjs/ant-design` so failed requests use the same
configured feedback behavior as `App`, `Form`, `Table`, and `Description`.

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

Optional hook configuration such as skip, debounce, polling, controlled data, or base URL overrides.

## Returns

[`FaasDataInjection`](../type-aliases/FaasDataInjection.md)\<`Path`\>

Request state and helper methods.

## Example

```tsx
import { useFaas } from '@faasjs/ant-design'

export function Profile(props: { id: number }) {
  const { data, loading, reload } = useFaas('features/users/api/get', { id: props.id })

  if (loading) return <div>Loading...</div>

  return <button onClick={() => reload()}>{data?.name}</button>
}
```
