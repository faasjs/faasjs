[@faasjs/react](../../../README.md) / OptionalWrapper

# OptionalWrapper

A wrapper component that conditionally wraps its children with a provided wrapper component.

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

## Variables

- [displayName](variables/displayName.md)
- [whyDidYouRender](variables/whyDidYouRender.md)
