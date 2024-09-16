[@faasjs/react](../README.md) / withFaasData

# Function: withFaasData()

> **withFaasData**\<`PathOrData`, `TComponentProps`\>(`Component`, `faasProps`): `React.FC`\<`Omit`\<`TComponentProps`, keyof [`FaasDataInjection`](../type-aliases/FaasDataInjection.md)\<`PathOrData`\>\> & `Record`\<`string`, `any`\>\>

HOC to wrap a component with FaasDataWrapper

## Type Parameters

• **PathOrData** *extends* [`FaasAction`](../type-aliases/FaasAction.md)

• **TComponentProps** *extends* [`FaasDataInjection`](../type-aliases/FaasDataInjection.md)\<`PathOrData`\> = [`FaasDataInjection`](../type-aliases/FaasDataInjection.md)\<`PathOrData`\>

## Parameters

• **Component**: `FC`\<`TComponentProps` & `Record`\<`string`, `any`\>\>

• **faasProps**: [`FaasDataWrapperProps`](../type-aliases/FaasDataWrapperProps.md)\<`PathOrData`\>

## Returns

`React.FC`\<`Omit`\<`TComponentProps`, keyof [`FaasDataInjection`](../type-aliases/FaasDataInjection.md)\<`PathOrData`\>\> & `Record`\<`string`, `any`\>\>

## Example

```tsx
const MyComponent = withFaasData(({ data }) => <div>{data.name}</div>, { action: 'test', params: { a: 1 } })
```
