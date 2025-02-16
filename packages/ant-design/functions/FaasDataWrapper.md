[@faasjs/ant-design](../README.md) / FaasDataWrapper

# Function: FaasDataWrapper()

> **FaasDataWrapper**\<`T`\>(`props`): `Element`

FaasDataWrapper component with Loading

## Type Parameters

• **T** = `any`

## Parameters

### props

[`FaasDataWrapperProps`](../interfaces/FaasDataWrapperProps.md)\<`T`\>

## Returns

`Element`

## Example

```tsx
function MyComponent (props: FaasDataInjection) {
  return <div>{ props.data }</div>
}

function MyPage () {
  return <FaasDataWrapper action="test" params={{ a: 1 }}>
    <MyComponent />
  </FaasDataWrapper>
}
```
