[@faasjs/ant-design](../README.md) / App

# Function: App()

> **App**(`props`): `Element`

Render the root provider shell for a FaasJS Ant Design application.

`App` initializes Ant Design message and notification APIs, exposes hook-managed modal and
drawer state through [AppContext](../variables/AppContext.md), and wraps descendants with [ErrorBoundary](ErrorBoundary.md).

## Parameters

### props

[`AppProps`](../interfaces/AppProps.md)

App shell props including providers and error handling options.

## Returns

`Element`

## Example

```tsx
import { App } from '@faasjs/ant-design'

export default function Page() {
  return (
    <App configProviderProps={{}} errorBoundaryProps={{}} faasConfigProviderProps={{}}>
      <div>content</div>
    </App>
  )
}
```
