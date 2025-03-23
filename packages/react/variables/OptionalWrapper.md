[@faasjs/react](../README.md) / OptionalWrapper

# Variable: OptionalWrapper

> `const` **OptionalWrapper**: `React.FC`\<[`OptionalWrapperProps`](../type-aliases/OptionalWrapperProps.md)\> & `object`

A wrapper component that conditionally wraps its children with a provided wrapper component.

## Type declaration

### whyDidYouRender

> **whyDidYouRender**: `boolean`

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
