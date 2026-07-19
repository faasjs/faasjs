[**@faasjs/react**](../README.md)

[@faasjs/react](../README.md) / OptionalWrapper

# Function: OptionalWrapper()

> **OptionalWrapper**(`props`): `string` \| `number` \| `bigint` \| `boolean` \| `Element` \| `Iterable`\<`ReactNode`, `any`, `any`> > > > \> \| `Promise`\<`AwaitedReactNode`> > > > \> \| `null` \| `undefined`

Conditionally wrap children with another component.

`Wrapper` is required for a stable component contract, but it is not rendered
and does not receive `wrapperProps` when `condition` is `false`.

## Parameters

### props

[`OptionalWrapperProps`](../type-aliases/OptionalWrapperProps.md)

Wrapper condition, wrapper component, and child content.

## Returns

`string` \| `number` \| `bigint` \| `boolean` \| `Element` \| `Iterable`\<`ReactNode`, `any`, `any`\> \| `Promise`\<`AwaitedReactNode`\> \| `null` \| `undefined`

Wrapped children or the original children when `condition` is false.

## Example

```tsx
import { OptionalWrapper } from '@faasjs/react'

const Wrapper = ({ children, className }: { children: React.ReactNode; className: string }) => (
  <div className={className}>{children}</div>
)

const App = () => (
  <OptionalWrapper condition={true} Wrapper={Wrapper} wrapperProps={{ className: 'wrapper' }}>
    <span>Test</span>
  </OptionalWrapper>
)
```
