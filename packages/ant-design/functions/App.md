[@faasjs/ant-design](../README.md) / App

# Function: App()

> **App**(`props`): `Element`

App component with Ant Design & FaasJS

- Based on Ant Design's [ConfigProvider](https://ant.design/components/config-provider/) and [StyleProvider](https://ant.design/components/style-provider/).
- Integrated Ant Design's [Message](https://ant.design/components/message/) and [Notification](https://ant.design/components/notification/).
- Based on FaasJS's [ConfigProvider](https://faasjs.com/doc/ant-design/#configprovider).
- Integrated FaasJS's [Modal](https://faasjs.com/doc/ant-design/#usemodal), [Drawer](https://faasjs.com/doc/ant-design/#usedrawer) and [ErrorBoundary](https://faasjs.com/doc/ant-design/#errorboundary).
- Integrated React Router's [BrowserRouter](https://reactrouter.com/en/router-components/browser-router).

## Parameters

• **props**: [`AppProps`](../interfaces/AppProps.md)

## Returns

`Element`

## Example

```tsx
import { App } from '@faasjs/ant-design'

export default function () {
  return (
    <App
     styleProviderProps={{}} // https://ant.design/docs/react/compatible-style#styleprovider
     configProviderProps={{}} // https://ant.design/components/config-provider/#API
     browserRouterProps={{}} // https://reactrouter.com/en/router-components/browser-router
     errorBoundaryProps={{}} // https://faasjs.com/doc/ant-design/#errorboundary
     faasConfigProviderProps={{}} // https://faasjs.com/doc/ant-design/#configprovider
    >
      <div>content</div>
    </App>
  )
```
