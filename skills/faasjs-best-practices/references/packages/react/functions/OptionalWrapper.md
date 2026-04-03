[@faasjs/react](../README.md) / OptionalWrapper

# Function: OptionalWrapper()

> **OptionalWrapper**(`props`): `string` \| `number` \| `bigint` \| `boolean` \| `Iterable`\<`ReactNode`, `any`, `any`\> \| `Promise`\<`AwaitedReactNode`\> \| `Element` \| `null` \| `undefined`

Conditionally wrap children with another component.

## Parameters

### props

[`OptionalWrapperProps`](../type-aliases/OptionalWrapperProps.md)

Wrapper condition, wrapper component, and child content.

## Returns

`string` \| `number` \| `bigint` \| `boolean` \| `Iterable`\<`ReactNode`, `any`, `any`\> \| `Promise`\<`AwaitedReactNode`\> \| `Element` \| `null` \| `undefined`

Wrapped children or the original children when `condition` is false.

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
