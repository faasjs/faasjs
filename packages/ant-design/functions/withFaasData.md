[@faasjs/ant-design](../README.md) / withFaasData

# Function: withFaasData()

> **withFaasData**\<`TComponent`, `PathOrData`\>(`Component`, `faasProps`): `FC`\<`Omit`\<`any`, keyof `FaasDataInjection`\> & `Record`\<`string`, `any`\>\>

HOC to wrap a component with FaasDataWrapper and Loading

## Type Parameters

• **TComponent** *extends* `FC`\<`any`\>

• **PathOrData** *extends* `FaasAction`

## Parameters

• **Component**: `TComponent`

• **faasProps**: [`FaasDataWrapperProps`](../interfaces/FaasDataWrapperProps.md)\<`PathOrData`\>

## Returns

`FC`\<`Omit`\<`any`, keyof `FaasDataInjection`\> & `Record`\<`string`, `any`\>\>

## Example

```tsx
const MyComponent = withFaasData(({ data }) => <div>{data.name}</div>, { action: 'test', params: { a: 1 } })
```
