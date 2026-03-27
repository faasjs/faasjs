[@faasjs/ant-design](../README.md) / ErrorBoundary

# Function: ErrorBoundary()

> **ErrorBoundary**(`props`): `Element`

Styled error boundary.

## Parameters

### props

[`ErrorBoundaryProps`](../interfaces/ErrorBoundaryProps.md)

Error boundary props forwarded to the underlying React implementation.

## Returns

`Element`

## Example

```tsx
import { ErrorBoundary } from '@faasjs/ant-design'

export function Page() {
  return (
    <ErrorBoundary>
      <DangerousWidget />
    </ErrorBoundary>
  )
}
```
