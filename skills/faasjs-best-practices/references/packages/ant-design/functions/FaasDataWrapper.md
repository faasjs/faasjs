[@faasjs/ant-design](../README.md) / FaasDataWrapper

# Function: FaasDataWrapper()

> **FaasDataWrapper**\<`T`\>(`props`): `Element`

Render the `@faasjs/react` data wrapper with an Ant Design loading fallback.

When `loading` is not provided, the component renders [Loading](Loading.md) with `loadingProps` while
the wrapped FaasJS request is pending.

## Type Parameters

### T

`T` _extends_ `FaasActionUnionType` = `any`

Action path or response data type used for inference.

## Parameters

### props

[`FaasDataWrapperProps`](../interfaces/FaasDataWrapperProps.md)\<`T`\>

Wrapper props including loading fallbacks and request configuration.

## Returns

`Element`

## Example

```tsx
import { FaasDataWrapper, type FaasDataInjection } from '@faasjs/ant-design'

function MyComponent(props: FaasDataInjection) {
  return <div>{props.data}</div>
}

function MyPage() {
  return (
    <FaasDataWrapper action="test" params={{ a: 1 }}>
      <MyComponent />
    </FaasDataWrapper>
  )
}
```
