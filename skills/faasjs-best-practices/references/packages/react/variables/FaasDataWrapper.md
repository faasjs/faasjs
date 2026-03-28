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

export function Greeting() {
  return (
    <FaasDataWrapper action="greeting/api/hello" params={{ name: 'FaasJS' }}>
      <div />
    </FaasDataWrapper>
  )
}
```

When a ref is provided, it exposes the current Faas request state imperatively.
