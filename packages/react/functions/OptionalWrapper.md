[@faasjs/react](../README.md) / OptionalWrapper

# Function: OptionalWrapper()

> **OptionalWrapper**(`props`): `ReactNode` \| `Promise`\<`ReactNode`\>

A wrapper component that conditionally wraps its children with a provided wrapper component.

## Parameters

### props

[`OptionalWrapperProps`](../type-aliases/OptionalWrapperProps.md)

## Returns

`ReactNode` \| `Promise`\<`ReactNode`\>

## Example

```tsx
import { OptionalWrapper } from '@faasjs/react'

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <div className='wrapper'>{children}</div>
)

const App = () => (
  <OptionalWrapper condition={true} Wrapper={Wrapper}>
    <span>Test</span>
  </OptionalWrapper>
)
```
