[@faasjs/react](../README.md) / withFaasData

# Function: withFaasData()

> **withFaasData**\<`PathOrData`, `TComponentProps`\>(`Component`, `faasProps`): `FC`\<`Omit`\<`TComponentProps`, keyof [`FaasDataInjection`](../type-aliases/FaasDataInjection.md)\<`PathOrData`\>\> & `Record`\<`string`, `any`\>\>

HOC to wrap a component with FaasDataWrapper

## Type Parameters

### PathOrData

`PathOrData` _extends_ [`FaasActionUnionType`](../type-aliases/FaasActionUnionType.md)

Action path or response data type used for inference.

### TComponentProps

`TComponentProps` _extends_ `Required`\<[`FaasDataInjection`](../type-aliases/FaasDataInjection.md)\<`PathOrData`\>\> = `Required`\<[`FaasDataInjection`](../type-aliases/FaasDataInjection.md)\<`PathOrData`\>\>

Component props including injected Faas data fields.

## Parameters

### Component

`FC`\<`TComponentProps`\>

Component that consumes injected Faas data props.

### faasProps

[`FaasDataWrapperProps`](../type-aliases/FaasDataWrapperProps.md)\<`PathOrData`\>

Request configuration forwarded to `FaasDataWrapper`.

Common `faasProps` fields include `render`, `children`, `fallback`, `action`,
`params`, `onDataChange`, `data`, `setData`, and `baseUrl`.

## Returns

`FC`\<`Omit`\<`TComponentProps`, keyof [`FaasDataInjection`](../type-aliases/FaasDataInjection.md)\<`PathOrData`\>\> & `Record`\<`string`, `any`\>\>

## Example

```tsx
const MyComponent = withFaasData(({ data }) => <div>{data.name}</div>, {
  action: 'test',
  params: { a: 1 },
})
```
