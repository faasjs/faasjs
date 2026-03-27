[@faasjs/react](../README.md) / FaasDataWrapper

# Variable: FaasDataWrapper

> `const` **FaasDataWrapper**: \<`PathOrData`\>(`props`) => `ReactElement`\<`unknown`, `string` \| `JSXElementConstructor`\<`any`\>\> \| `null`

Fetch FaasJS data and inject the result into a render prop or child element.

## Type Parameters

### PathOrData

`PathOrData` _extends_ [`FaasActionUnionType`](../type-aliases/FaasActionUnionType.md) = `any`

## Parameters

### props

[`FaasDataWrapperProps`](../type-aliases/FaasDataWrapperProps.md)\<`PathOrData`\> & `RefAttributes`\<[`FaasDataWrapperRef`](../type-aliases/FaasDataWrapperRef.md)\<`PathOrData`\>\>

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
