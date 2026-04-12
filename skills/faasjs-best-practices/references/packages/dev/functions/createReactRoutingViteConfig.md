[@faasjs/dev](../README.md) / createReactRoutingViteConfig

# Function: createReactRoutingViteConfig()

> **createReactRoutingViteConfig**(`options?`): `UserConfig`

Create the shared Vite config for React SSR apps that use file-based routing.

This extends [viteConfig](../variables/viteConfig.md) with a second SSR build environment so a plain
`vp build` emits both the client bundle and the React SSR `dist-server`
bundle. Use it when the app relies on `@faasjs/react/routing` and should
not keep a local SSR build script.

## Parameters

### options?

[`ReactRoutingViteConfigOptions`](../type-aliases/ReactRoutingViteConfigOptions.md) = `{}`

Optional SSR build overrides.

## Returns

`UserConfig`

Vite config with both client and SSR builds configured.

## Example

```ts
import { defineConfig } from 'vite-plus'
import { createReactRoutingViteConfig } from '@faasjs/dev'

export default defineConfig(createReactRoutingViteConfig())
```
