[@faasjs/ant-design](../README.md) / ErrorBoundary

# Function: ErrorBoundary()

> **ErrorBoundary**(`props`): `Element`

Styled error boundary.

## Parameters

### props

[`ErrorBoundaryProps`](../interfaces/ErrorBoundaryProps.md)

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
