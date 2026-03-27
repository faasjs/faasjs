[@faasjs/react](../README.md) / OptionalWrapper

# Function: OptionalWrapper()

> **OptionalWrapper**(`props`): `string` \| `number` \| `bigint` \| `boolean` \| `Element` \| `Iterable`\<`ReactNode`, `any`, `any`\> \| `Promise`\<`AwaitedReactNode`\> \| `null` \| `undefined`

A wrapper component that conditionally wraps its children with a provided wrapper component.

## Parameters

### props

[`OptionalWrapperProps`](../type-aliases/OptionalWrapperProps.md)

Wrapper condition, wrapper component, and child content.

## Returns

`string` \| `number` \| `bigint` \| `boolean` \| `Element` \| `Iterable`\<`ReactNode`, `any`, `any`\> \| `Promise`\<`AwaitedReactNode`\> \| `null` \| `undefined`

## Example

```tsx
import { OptionalWrapper } from '@faasjs/react'

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="wrapper">{children}</div>
)

const App = () => (
  <OptionalWrapper condition={true} Wrapper={Wrapper}>
    <span>Test</span>
  </OptionalWrapper>
)
```
