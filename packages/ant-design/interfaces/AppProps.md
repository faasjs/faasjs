[@faasjs/ant-design](../README.md) / AppProps

# Interface: AppProps

Props for the root [App](../functions/App.md) shell.

`App` composes the Ant Design provider tree, FaasJS config provider, shared modal and drawer
state, and optional browser routing into a single wrapper component.

## Properties

### browserRouterProps?

> `optional` **browserRouterProps?**: `false` \| `BrowserRouterProps`

Props forwarded to React Router's `BrowserRouter`, or `false` to disable browser routing.

Routing is enabled automatically when running in a browser and this prop is not `false`.

#### See

[React Router BrowserRouterProps](https://api.reactrouter.com/v7/interfaces/react_router.BrowserRouterProps.html)

### children

> **children**: `ReactNode`

Descendant elements rendered inside all configured providers.

### configProviderProps?

> `optional` **configProviderProps?**: `ConfigProviderProps`

Props forwarded to Ant Design's `ConfigProvider`.

#### See

[Ant Design ConfigProvider API](https://ant.design/components/config-provider/#API)

### errorBoundaryProps?

> `optional` **errorBoundaryProps?**: `Omit`\<[`ErrorBoundaryProps`](ErrorBoundaryProps.md), `"children"`\>

Props forwarded to [ErrorBoundary](../functions/ErrorBoundary.md).

#### See

[FaasJS Ant Design ErrorBoundary docs](https://faasjs.com/doc/ant-design/#errorboundary)

### faasConfigProviderProps?

> `optional` **faasConfigProviderProps?**: `false` \| `Omit`\<[`ConfigProviderProps`](ConfigProviderProps.md), `"children"`\>

Props forwarded to [ConfigProvider](../functions/ConfigProvider.md), or `false` to skip the FaasJS config layer.

#### See

[FaasJS Ant Design ConfigProvider docs](https://faasjs.com/doc/ant-design/#configprovider)
