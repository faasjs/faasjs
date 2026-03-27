[@faasjs/ant-design](../README.md) / Loading

# Function: Loading()

> **Loading**(`props`): `Element`

Loading component based on Spin

## Parameters

### props

[`LoadingProps`](../type-aliases/LoadingProps.md)

Loading indicator props and optional wrapped children.

## Returns

`Element`

## Example

```tsx
<Loading /> // display loading

<Loading loading={ !remoteData }>
  <div>{remoteData}</div>
</Loading>
```
