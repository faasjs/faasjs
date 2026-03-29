[@faasjs/react](../README.md) / FaasDataWrapper

# Variable: FaasDataWrapper

> `const` **FaasDataWrapper**: \<`PathOrData`\>(`props`) => `ReactElement`\<`unknown`, `string` \| `JSXElementConstructor`\<`any`\>\> \| `null`

Fetch FaasJS data and inject the result into a render prop or child element.

The wrapper defers rendering `children` or `render` until the first request
completes, then keeps passing the latest request state to the rendered output.

## Type Parameters

### PathOrData

`PathOrData` _extends_ [`FaasActionUnionType`](../type-aliases/FaasActionUnionType.md) = `any`

## Parameters

### props

[`FaasDataWrapperProps`](../type-aliases/FaasDataWrapperProps.md)\<`PathOrData`\> & `RefAttributes`\<[`FaasDataWrapperRef`](../type-aliases/FaasDataWrapperRef.md)\<`PathOrData`\>\>

Wrapper props controlling the request and rendered fallback.

## Returns

`ReactElement`\<`unknown`, `string` \| `JSXElementConstructor`\<`any`\>\> \| `null`

## Example

```tsx
import { FaasDataWrapper } from '@faasjs/react'

type User = {
  name: string
}

function UserView(props: { data?: User; error?: Error; reload?: () => void }) {
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
    <FaasDataWrapper<User>
      action="user/get"
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
    <FaasDataWrapper<User>
      action="user/get"
      params={{ id: props.id }}
      fallback={<div>Loading user...</div>}
    >
      <UserView />
    </FaasDataWrapper>
  )
}
```

When a ref is provided, it exposes the current Faas request state imperatively.
