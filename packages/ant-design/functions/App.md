[@faasjs/ant-design](../README.md) / App

# Function: App()

> **App**(`props`): `Element`

App component with Ant Design & FaasJS

- Based on Ant Design's [ConfigProvider](https://ant.design/components/config-provider/).
- Integrated Ant Design's [Message](https://ant.design/components/message/) and [Notification](https://ant.design/components/notification/).
- Based on FaasJS's [ConfigProvider](https://faasjs.com/doc/ant-design/#configprovider).
- Integrated FaasJS's [Modal](https://faasjs.com/doc/ant-design/#usemodal), [Drawer](https://faasjs.com/doc/ant-design/#usedrawer) and [ErrorBoundary](https://faasjs.com/doc/ant-design/#errorboundary).
- Integrated React Router's [BrowserRouter](https://api.reactrouter.com/v7/interfaces/react_router.BrowserRouterProps.html).

## Parameters

### props

[`AppProps`](../interfaces/AppProps.md)

## Returns

`Element`

## Example

```tsx
import { App } from '@faasjs/ant-design'

export default function () {
  return (
    <App
      configProviderProps={{}} // https://ant.design/components/config-provider/#API
      browserRouterProps={{}} // https://api.reactrouter.com/v7/interfaces/react_router.BrowserRouterProps.html
      errorBoundaryProps={{}} // https://faasjs.com/doc/ant-design/#errorboundary
      faasConfigProviderProps={{}} // https://faasjs.com/doc/ant-design/#configprovider
    >
      <div>content</div>
    </App>
  )
}
```
