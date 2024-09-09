[@faasjs/react](../README.md) / withFaasData

# Function: withFaasData()

> **withFaasData**\<`TComponent`, `PathOrData`\>(`Component`, `faasProps`): (`props`) => `Element`

HOC to wrap a component with FaasDataWrapper

## Type Parameters

• **TComponent** *extends* `FC`\<`any`\>

• **PathOrData** *extends* `Record`\<`string`, `any`\>

## Parameters

• **Component**: `TComponent`

• **faasProps**: [`FaasDataWrapperProps`](../type-aliases/FaasDataWrapperProps.md)\<`PathOrData`\>

## Returns

`Function`

### Parameters

• **props**: `Omit`\<`ComponentProps`\<`TComponent`\>, `"data"`\>

### Returns

`Element`

## Example

```tsx
const MyComponent = withFaasData(MyComponent, { action: 'test', params: { a: 1 } })
```
