[@faasjs/ant-design](../README.md) / withFaasData

# Function: withFaasData()

> **withFaasData**\<`PathOrData`, `TComponentProps`\>(`Component`, `faasProps`): `FC`\<`Omit`\<`TComponentProps`, keyof `FaasDataInjection`\<`PathOrData`\>\>\>

HOC to wrap a component with FaasDataWrapper and Loading

## Type Parameters

### PathOrData

`PathOrData` _extends_ `FaasActionUnionType`

### TComponentProps

`TComponentProps` _extends_ `Required`\<`Partial`\<`FaasDataInjection`\<`PathOrData`\>\>\> = `Required`\<`Partial`\<`FaasDataInjection`\<`PathOrData`\>\>\>

## Parameters

### Component

`FC`\<`TComponentProps` & `Record`\<`string`, `any`\>\>

### faasProps

[`FaasDataWrapperProps`](../interfaces/FaasDataWrapperProps.md)\<`PathOrData`\>

## Returns

`FC`\<`Omit`\<`TComponentProps`, keyof `FaasDataInjection`\<`PathOrData`\>\>\>

## Example

```tsx
const MyComponent = withFaasData(({ data }) => <div>{data.name}</div>, {
  action: 'test',
  params: { a: 1 },
})
```
