[@faasjs/react](../README.md) / withFaasData

# Function: withFaasData()

> **withFaasData**\<`Path`, `TComponentProps`\>(`Component`, `faasProps`): `FC`\<`Omit`\<`TComponentProps`, keyof [`FaasDataInjection`](../type-aliases/FaasDataInjection.md)\<`Path`\>\> & `Record`\<`string`, `any`\>\>

Wrap a component with [FaasDataWrapper](../variables/FaasDataWrapper.md) and inject Faas request state as props.

`withFaasData` is most useful for wrapper-style exports or when you want to
preserve an existing component boundary. For new code, prefer `useFaas` or
`FaasDataWrapper` when they express the request ownership more directly.

## Type Parameters

### Path

`Path` _extends_ `FaasActionPaths`

Registered action path used to infer params and response data.

### TComponentProps

`TComponentProps` _extends_ `Required`\<[`FaasDataInjection`](../type-aliases/FaasDataInjection.md)\<`Path`\>\> = `Required`\<[`FaasDataInjection`](../type-aliases/FaasDataInjection.md)\<`Path`\>\>

Component props including every field from [FaasDataInjection](../type-aliases/FaasDataInjection.md).

## Parameters

### Component

`FC`\<`TComponentProps`\>

Component that consumes injected Faas data props.

### faasProps

[`FaasDataWrapperProps`](../type-aliases/FaasDataWrapperProps.md)\<`Path`\>

Request configuration forwarded to `FaasDataWrapper`; this is the second argument.

## Returns

`FC`\<`Omit`\<`TComponentProps`, keyof [`FaasDataInjection`](../type-aliases/FaasDataInjection.md)\<`Path`\>\> & `Record`\<`string`, `any`\>\>

Component that accepts caller-owned props while `withFaasData` supplies the Faas data props.

## Example

```tsx
import { type FaasDataInjection, withFaasData } from '@faasjs/react'

declare module '@faasjs/types' {
  interface FaasActions {
    'features/users/api/get': {
      Params: { id: number }
      Data: { name: string }
    }
  }
}

type GetUserAction = 'features/users/api/get'
type UserCardProps = FaasDataInjection<GetUserAction> & {
  compact?: boolean
}

const UserCard = ({ data, error, reload, compact }: UserCardProps) => {
  if (error) {
    return (
      <button type="button" onClick={() => reload()}>
        Retry
      </button>
    )
  }

  return <div>{compact ? data.name : `User: ${data.name}`}</div>
}

const UserCardWithData = withFaasData<GetUserAction, UserCardProps>(UserCard, {
  action: 'features/users/api/get',
  params: { id: 1 },
})
```
