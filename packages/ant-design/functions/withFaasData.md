[@faasjs/ant-design](../README.md) / withFaasData

# Function: withFaasData()

> **withFaasData**\<`Path`, `TComponentProps`\>(`Component`, `faasProps`): `FC`\<`Omit`\<`TComponentProps`, keyof `FaasDataInjection`\<`Path`\>\>\>

Wrap a component with [FaasDataWrapper](FaasDataWrapper.md) and its Ant Design loading fallback.

## Type Parameters

### Path

`Path` _extends_ `FaasActionPaths`

Action path or response data type used for inference.

### TComponentProps

`TComponentProps` _extends_ `Required`\<`Partial`\<`FaasDataInjection`\<`Path`\>\>\> = `Required`\<`Partial`\<`FaasDataInjection`\<`Path`\>\>\>

Component props including injected Faas data fields.

## Parameters

### Component

`FC`\<`TComponentProps` & `Record`\<`string`, `any`\>\>

Component that consumes injected Faas data props.

### faasProps

[`FaasDataWrapperProps`](../interfaces/FaasDataWrapperProps.md)\<`Path`\>

Request configuration forwarded to [FaasDataWrapper](FaasDataWrapper.md).

## Returns

`FC`\<`Omit`\<`TComponentProps`, keyof `FaasDataInjection`\<`Path`\>\>\>

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
