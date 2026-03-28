[@faasjs/ant-design](../README.md) / Routes

# Function: Routes()

> **Routes**(`props`): `Element`

Render React Router routes with lazy-page support and a default 404 route.

The wrapper adds a catch-all route automatically and uses an Ant Design `Skeleton` fallback when
`fallback` is not provided.

## Parameters

### props

[`RoutesProps`](../interfaces/RoutesProps.md)

Route definitions and optional fallback or 404 elements.

## Returns

`Element`

## Example

```tsx
import { Routes, lazy } from '@faasjs/ant-design'
import { BrowserRouter } from 'react-router-dom'

export function App() {
  return (
    <BrowserRouter>
      <Routes
        routes={[
          {
            path: '/',
            page: lazy(() => import('./pages/home')),
          },
        ]}
      />
    </BrowserRouter>
  )
}
```
