[@faasjs/ant-design](../README.md) / App

# Function: App()

> **App**(`props`): `Element`

Render the root provider shell for a FaasJS Ant Design application.

`App` initializes Ant Design message and notification APIs, exposes hook-managed modal and
drawer state through [AppContext](../variables/AppContext.md), wraps descendants with [ErrorBoundary](ErrorBoundary.md), and
optionally mounts React Router's `BrowserRouter`.

## Parameters

### props

[`AppProps`](../interfaces/AppProps.md)

App shell props including providers, routing, and error handling options.

## Returns

`Element`

## Example

```tsx
import { App } from '@faasjs/ant-design'

export default function Page() {
  return (
    <App
      configProviderProps={{}}
      browserRouterProps={{}}
      errorBoundaryProps={{}}
      faasConfigProviderProps={{}}
    >
      <div>content</div>
    </App>
  )
}
```
