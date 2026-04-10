[@faasjs/dev](../README.md) / ReactAutoPagesViteConfigOptions

# Type Alias: ReactAutoPagesViteConfigOptions

> **ReactAutoPagesViteConfigOptions** = `object`

Options for [createReactAutoPagesViteConfig](../functions/createReactAutoPagesViteConfig.md).

## Properties

### serverEntry?

> `optional` **serverEntry?**: `string`

Optional override for the React SSR server entry module.

Defaults to `@faasjs/react/auto-pages/server-entry`.

### ssrOutDir?

> `optional` **ssrOutDir?**: `string`

SSR output directory used for the built `server-entry` bundle.

#### Default

```ts
'dist-server'
```
