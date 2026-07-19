[**@faasjs/react**](../README.md)

[@faasjs/react](../README.md) / FaasDataWrapper

# Variable: FaasDataWrapper

> `const` **FaasDataWrapper**: \<`Path`>>>>\>(`props`) => `ReactElement`\<`unknown`, `string` \| `JSXElementConstructor`\<`any`>> >> >> >> \>\> \| `null`

Fetch FaasJS data and inject the result into a render prop or child element.

The wrapper defers rendering `children` or `render` until the first request
completes, then keeps passing the latest request state to the rendered output.

## Type Parameters

### Path

`Path` _extends_ `FaasActionPaths`

## Parameters

### props

[`FaasDataWrapperProps`](../type-aliases/FaasDataWrapperProps.md)\<`Path`\> & `RefAttributes`\<[`FaasDataWrapperRef`](../type-aliases/FaasDataWrapperRef.md)\<`Path`\>\>

Wrapper props controlling the request and rendered fallback.

## Returns

`ReactElement`\<`unknown`, `string` \| `JSXElementConstructor`\<`any`\>\> \| `null`

## Example

```tsx
import { FaasDataWrapper } from '@faasjs/react'
import type { FaasDataInjection } from '@faasjs/react'

declare module '@faasjs/types' {
  interface FaasActions {
    'features/users/api/get': {
      Params: { id: number }
      Data: { name: string }
    }
  }
}

type GetUserAction = 'features/users/api/get'

function UserView(props: {
  data?: FaasDataInjection<GetUserAction>['data']
  error?: Error
  reload?: () => void
}) {
  if (props.error) {
    return (
      <div>
        <p>Failed to load user: {props.error.message}</p>
        <button type="button" onClick={() => props.reload?.()}>
          Retry
        </button>
      </div>
    )
  }

  return <div>Hello, {props.data?.name}</div>
}

// Render-prop mode
export function UserProfile(props: { id: number }) {
  return (
    <FaasDataWrapper<GetUserAction>
      action="features/users/api/get"
      params={{ id: props.id }}
      fallback={<div>Loading user...</div>}
      render={({ data, error, reload }) => {
        if (error) {
          return (
            <div>
              <p>Failed to load user: {error.message}</p>
              <button type="button" onClick={() => reload()}>
                Retry
              </button>
            </div>
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
      action="features/users/api/get"
      params={{ id: props.id }}
      fallback={<div>Loading user...</div>}
    >
      <UserView />
    </FaasDataWrapper>
  )
}
```

When a ref is provided, it exposes the current Faas request state imperatively.
