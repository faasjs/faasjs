[@faasjs/ant-design](../README.md) / Routes

# Function: Routes()

> **Routes**(`props`): `Element`

Routes with lazy loading and 404 page.

## Parameters

• **props**: [`RoutesProps`](../interfaces/RoutesProps.md)

## Returns

`Element`

## Example

```tsx
import { Routes, lazy } from '@faasjs/ant-design'
import { BrowserRouter } from 'react-router-dom'

export function App () {
  return <BrowserRouter>
    <Routes routes={[
      {
        path: '/',
        page: lazy(() => import('./pages/home'))
      }
    ]} />
  </BrowserRouter>
}
```
