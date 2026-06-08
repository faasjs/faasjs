[@faasjs/ant-design](../README.md) / withFaasData

# Function: withFaasData()

> **withFaasData**\<`Path`, `TComponentProps`\>(`Component`, `faasProps`): `FC`\<`Omit`\<`TComponentProps`, keyof [`FaasDataInjection`](../type-aliases/FaasDataInjection.md)\<`Path`\>\>\>

Wrap a component with [FaasDataWrapper](FaasDataWrapper.md) and its Ant Design loading fallback.

## Type Parameters

### Path

`Path` _extends_ `FaasActionPaths`

Registered action path used to infer params and response data.

### TComponentProps

`TComponentProps` _extends_ `Required`\<[`FaasDataInjection`](../type-aliases/FaasDataInjection.md)\<`Path`\>\> = `Required`\<[`FaasDataInjection`](../type-aliases/FaasDataInjection.md)\<`Path`\>\>

Component props including every field from [FaasDataInjection](../type-aliases/FaasDataInjection.md).

## Parameters

### Component

`FC`\<`TComponentProps` & `Record`\<`string`, `any`\>\>

Component that consumes injected Faas data props.

### faasProps

[`FaasDataWrapperProps`](../interfaces/FaasDataWrapperProps.md)\<`Path`\>

Request configuration forwarded to [FaasDataWrapper](FaasDataWrapper.md); this is the second argument.

## Returns

`FC`\<`Omit`\<`TComponentProps`, keyof [`FaasDataInjection`](../type-aliases/FaasDataInjection.md)\<`Path`\>\>\>

Higher-order component that accepts caller-owned props while `withFaasData` supplies the Faas data props.

## Example

```tsx
import { type FaasDataInjection, withFaasData } from '@faasjs/ant-design'

declare module '@faasjs/types' {
  interface FaasActions {
    'user/get': {
      Params: { id: number }
      Data: { name: string }
    }
  }
}

type GetUserAction = 'user/get'
type UserCardProps = FaasDataInjection<GetUserAction> & {
  compact?: boolean
}

const UserCard = ({ data, error, reload, compact }: UserCardProps) =>
  error ? (
    <a onClick={() => reload()}>Retry</a>
  ) : (
    <div>{compact ? data.name : `User: ${data.name}`}</div>
  )

const UserCardWithData = withFaasData<GetUserAction, UserCardProps>(UserCard, {
  action: 'user/get',
  params: { id: 1 },
})
```
