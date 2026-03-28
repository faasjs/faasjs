[@faasjs/ant-design](../README.md) / ErrorBoundary

# Function: ErrorBoundary()

> **ErrorBoundary**(`props`): `Element`

Styled error boundary.

When `errorChildren` is not provided, the fallback UI renders an Ant Design `Alert` containing
the captured error message and description.

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
