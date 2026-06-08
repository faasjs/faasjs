[@faasjs/ant-design](../README.md) / AppProps

# Interface: AppProps

Props for the root [App](../functions/App.md) shell.

`App` composes Ant Design feedback APIs, the FaasJS Ant Design config layer,
shared modal and drawer state, error handling, and optional browser routing
into a single wrapper component. Use `configProviderProps` for Ant Design's
own `ConfigProvider`; use `faasConfigProviderProps` for the FaasJS
`ConfigProvider` exported by this package.

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

Omit this prop when you do not need Ant Design token, locale, direction, or
component config overrides from this root shell.

#### See

[Ant Design ConfigProvider API](https://ant.design/components/config-provider/#API)

### errorBoundaryProps?

> `optional` **errorBoundaryProps?**: `Omit`\<[`ErrorBoundaryProps`](ErrorBoundaryProps.md), `"children"`\>

Props forwarded to [ErrorBoundary](../functions/ErrorBoundary.md).

#### See

[FaasJS Ant Design ErrorBoundary docs](https://faasjs.com/doc/ant-design/#errorboundary)

### faasConfigProviderProps?

> `optional` **faasConfigProviderProps?**: `false` \| `Omit`\<[`ConfigProviderProps`](ConfigProviderProps.md), `"children"`\>

Props forwarded to the FaasJS Ant Design [ConfigProvider](../functions/ConfigProvider.md).

`App` still mounts the FaasJS config layer so descendants can read theme
defaults. Pass `false` to use only the built-in defaults and App's default
`onError` handler.

#### See

[FaasJS Ant Design ConfigProvider docs](https://faasjs.com/doc/ant-design/#configprovider)
