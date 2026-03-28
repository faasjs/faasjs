[@faasjs/ant-design](../README.md) / Loading

# Function: Loading()

> **Loading**(`props`): `Element`

Render an Ant Design loading spinner with an optional content fallback.

## Parameters

### props

[`LoadingProps`](../type-aliases/LoadingProps.md)

Loading indicator props and optional wrapped children.

## Returns

`Element`

## Example

```tsx
import { Loading } from '@faasjs/ant-design'

export function Page({ remoteData }: { remoteData?: string }) {
  return (
    <>
      <Loading />
      <Loading loading={!remoteData}>
        <div>{remoteData}</div>
      </Loading>
    </>
  )
}
```
