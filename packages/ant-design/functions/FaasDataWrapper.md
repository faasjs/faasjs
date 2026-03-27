[@faasjs/ant-design](../README.md) / FaasDataWrapper

# Function: FaasDataWrapper()

> **FaasDataWrapper**\<`T`\>(`props`): `Element`

FaasDataWrapper component with Loading

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
