[@faasjs/react](../README.md) / withFaasData

# Function: withFaasData()

> **withFaasData**\<`PathOrData`, `TComponentProps`\>(`Component`, `faasProps`): `FC`\<`Omit`\<`TComponentProps`, keyof [`FaasDataInjection`](../type-aliases/FaasDataInjection.md)\<`PathOrData`\>\> & `Record`\<`string`, `any`\>\>

HOC to wrap a component with FaasDataWrapper

## Type Parameters

### PathOrData

`PathOrData` *extends* `unknown`

### TComponentProps

`TComponentProps` *extends* `Required`\<[`FaasDataInjection`](../type-aliases/FaasDataInjection.md)\<`PathOrData`\>\> = `Required`\<[`FaasDataInjection`](../type-aliases/FaasDataInjection.md)\<`PathOrData`\>\>

## Parameters

### Component

`FC`\<`TComponentProps`\>

### faasProps

[`FaasDataWrapperProps`](../type-aliases/FaasDataWrapperProps.md)\<`PathOrData`\>

## Returns

`FC`\<`Omit`\<`TComponentProps`, keyof [`FaasDataInjection`](../type-aliases/FaasDataInjection.md)\<`PathOrData`\>\> & `Record`\<`string`, `any`\>\>

## Example

```tsx
const MyComponent = withFaasData(({ data }) => <div>{data.name}</div>, { action: 'test', params: { a: 1 } })
```
