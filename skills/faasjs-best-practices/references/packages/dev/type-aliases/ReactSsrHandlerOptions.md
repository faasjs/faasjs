[@faasjs/dev](../README.md) / ReactSsrHandlerOptions

# Type Alias: ReactSsrHandlerOptions

> **ReactSsrHandlerOptions** = `object`

Options for [reactSsrHandler](../functions/reactSsrHandler.md).

## Properties

### renderPage?

> `optional` **renderPage?**: [`ReactSsrRenderPage`](ReactSsrRenderPage.md) \| `string` \| `string`[]

React SSR page renderer or path(s) to a built module that exports it.

### renderPageExport?

> `optional` **renderPageExport?**: `string`

Export name used when loading `renderPage` from a module path.

#### Default

```ts
'renderPage'
```

### root

> **root**: `string`

Directory containing built client assets and `index.html`.

### serverRoot?

> `optional` **serverRoot?**: `string`

Directory containing the built React SSR entry bundle.

When `renderPage` is omitted, `reactSsrHandler()` looks for
`entry-server.*` and `server-entry.*` under this directory.

### template?

> `optional` **template?**: `string`

Template file under `root`.

#### Default

```ts
'index.html'
```
