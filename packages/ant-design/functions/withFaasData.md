[@faasjs/ant-design](../README.md) / withFaasData

# Function: withFaasData()

> **withFaasData**\<`PathOrData`, `TComponentProps`\>(`Component`, `faasProps`): `FC`\<`Omit`\<`TComponentProps`, keyof `FaasDataInjection`\<`PathOrData`\>\>\>

Wrap a component with [FaasDataWrapper](FaasDataWrapper.md) and its Ant Design loading fallback.

## Type Parameters

### PathOrData

`PathOrData` _extends_ `FaasActionUnionType`

Action path or response data type used for inference.

### TComponentProps

`TComponentProps` _extends_ `Required`\<`Partial`\<`FaasDataInjection`\<`PathOrData`\>\>\> = `Required`\<`Partial`\<`FaasDataInjection`\<`PathOrData`\>\>\>

Component props including injected Faas data fields.

## Parameters

### Component

`FC`\<`TComponentProps` & `Record`\<`string`, `any`\>\>

Component that consumes injected Faas data props.

### faasProps

[`FaasDataWrapperProps`](../interfaces/FaasDataWrapperProps.md)\<`PathOrData`\>

Request configuration forwarded to [FaasDataWrapper](FaasDataWrapper.md).

## Returns

`FC`\<`Omit`\<`TComponentProps`, keyof `FaasDataInjection`\<`PathOrData`\>\>\>

Higher-order component that injects Faas data props.

## Example

```tsx
import { withFaasData } from '@faasjs/ant-design'

const UserCard = withFaasData(
  ({ data, error, reload }) =>
    error ? <a onClick={() => reload()}>Retry</a> : <div>{data.name}</div>,
  { action: 'user/get', params: { id: 1 } },
)
```
