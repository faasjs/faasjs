[@faasjs/dev](../README.md) / ReactRoutingViteConfigOptions

# Type Alias: ReactRoutingViteConfigOptions

> **ReactRoutingViteConfigOptions** = `object`

Options for [createReactRoutingViteConfig](../functions/createReactRoutingViteConfig.md).

## Properties

### serverEntry?

> `optional` **serverEntry?**: `string`

Optional override for the React SSR server entry module.

Defaults to `@faasjs/react/routing/server-entry`.

### ssrOutDir?

> `optional` **ssrOutDir?**: `string`

SSR output directory used for the built `server-entry` bundle.

#### Default

```ts
'dist-server'
```
