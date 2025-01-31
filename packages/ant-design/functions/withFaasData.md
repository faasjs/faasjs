[@faasjs/ant-design](../README.md) / withFaasData

# Function: withFaasData()

> **withFaasData**\<`PathOrData`, `TComponentProps`\>(`Component`, `faasProps`): `React.FC`\<`Omit`\<`TComponentProps`, keyof [`FaasDataInjection`](../type-aliases/FaasDataInjection.md)\<`PathOrData`\>\>\>

HOC to wrap a component with FaasDataWrapper and Loading

## Type Parameters

• **PathOrData** *extends* `FaasActionUnionType`

• **TComponentProps** *extends* `Required`\<`Partial`\<`FaasDataInjection`\<`PathOrData`\>\>\> = `Required`\<`Partial`\<`FaasDataInjection`\<`PathOrData`\>\>\>

## Parameters

### Component

`FC`\<`TComponentProps` & `Record`\<`string`, `any`\>\>

### faasProps

[`FaasDataWrapperProps`](../interfaces/FaasDataWrapperProps.md)\<`PathOrData`\>

## Returns

`React.FC`\<`Omit`\<`TComponentProps`, keyof [`FaasDataInjection`](../type-aliases/FaasDataInjection.md)\<`PathOrData`\>\>\>

## Example

```tsx
const MyComponent = withFaasData(({ data }) => <div>{data.name}</div>, { action: 'test', params: { a: 1 } })
```
