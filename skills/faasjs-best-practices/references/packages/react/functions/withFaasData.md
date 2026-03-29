[@faasjs/react](../README.md) / withFaasData

# Function: withFaasData()

> **withFaasData**\<`PathOrData`, `TComponentProps`\>(`Component`, `faasProps`): `FC`\<`Omit`\<`TComponentProps`, keyof [`FaasDataInjection`](../type-aliases/FaasDataInjection.md)\<`PathOrData`\>\> & `Record`\<`string`, `any`\>\>

Wrap a component with [FaasDataWrapper](../variables/FaasDataWrapper.md) and inject Faas request state as props.

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

## Returns

`FC`\<`Omit`\<`TComponentProps`, keyof [`FaasDataInjection`](../type-aliases/FaasDataInjection.md)\<`PathOrData`\>\> & `Record`\<`string`, `any`\>\>

Component that accepts the original props minus the injected Faas data fields.

## Example

```tsx
import { withFaasData } from '@faasjs/react'

const MyComponent = withFaasData(
  ({ data, error, reload }) => {
    if (error) {
      return (
        <button type="button" onClick={() => reload()}>
          Retry
        </button>
      )
    }

    return <div>{data.name}</div>
  },
  { action: 'user/get', params: { id: 1 } },
)
```
