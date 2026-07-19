[**@faasjs/ant-design**](../README.md)

[@faasjs/ant-design](../README.md) / FaasDataWrapper

# Function: FaasDataWrapper()

> **FaasDataWrapper**\<`T`>>>>\>(`props`): `Element`

Render the `@faasjs/react` data wrapper with an Ant Design loading fallback.

When `loading` is not provided, the component renders [Loading](Loading.md) with `loadingProps` while
the wrapped FaasJS request is pending.

## Type Parameters

### T

`T` _extends_ `FaasActionPaths` = `any`

Registered action path used to infer params and response data.

## Parameters

### props

[`FaasDataWrapperProps`](../interfaces/FaasDataWrapperProps.md)\<`T`\>

Wrapper props including loading fallbacks and request configuration.

## Returns

`Element`

## Example

```tsx
import { Alert, Button } from 'antd'
import { FaasDataWrapper } from '@faasjs/ant-design'
import type { FaasDataInjection } from '@faasjs/ant-design'

declare module '@faasjs/types' {
  interface FaasActions {
    'user/get': {
      Params: { id: number }
      Data: { name: string }
    }
  }
}

type GetUserAction = 'user/get'

function UserView(props: {
  data?: FaasDataInjection<GetUserAction>['data']
  error?: Error
  reload?: () => void
}) {
  if (props.error) {
    return (
      <Alert
        type="error"
        message={props.error.message}
        action={
          <Button size="small" onClick={() => props.reload?.()}>
            Retry
          </Button>
        }
      />
    )
  }

  return <div>Hello, {props.data?.name}</div>
}

// Render-prop mode
export function UserProfile(props: { id: number }) {
  return (
    <FaasDataWrapper<GetUserAction>
      action="user/get"
      params={{ id: props.id }}
      loading={<div>Loading user...</div>}
      render={({ data, error, reload }) => {
        if (error) {
          return (
            <Alert
              type="error"
              message={error.message}
              action={
                <Button size="small" onClick={() => reload()}>
                  Retry
                </Button>
              }
            />
          )
        }

        return <div>Hello, {data.name}</div>
      }}
    />
  )
}

// Children injection mode
export function UserProfileWithChildren(props: { id: number }) {
  return (
    <FaasDataWrapper<GetUserAction>
      action="user/get"
      params={{ id: props.id }}
      loading={<div>Loading user...</div>}
    >
      <UserView />
    </FaasDataWrapper>
  )
}
```
