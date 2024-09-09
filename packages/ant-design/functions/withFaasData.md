[@faasjs/ant-design](../README.md) / withFaasData

# Function: withFaasData()

> **withFaasData**\<`TComponent`, `PathOrData`\>(`Component`, `faasProps`): (`props`) => `Element`

HOC to wrap a component with FaasDataWrapper and Loading

## Type Parameters

• **TComponent** *extends* `FC`\<`any`\>

• **PathOrData** *extends* `Record`\<`string`, `any`\>

## Parameters

• **Component**: `TComponent`

• **faasProps**: [`FaasDataWrapperProps`](../interfaces/FaasDataWrapperProps.md)\<`PathOrData`\>

## Returns

`Function`

### Parameters

• **props**: `ComponentProps`\<`TComponent`\> & `object`

### Returns

`Element`

## Example

```tsx
const MyComponent = withFaasData(MyComponent, { action: 'test', params: { a: 1 } })
```
