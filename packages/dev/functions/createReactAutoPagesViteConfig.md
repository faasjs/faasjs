[@faasjs/dev](../README.md) / createReactAutoPagesViteConfig

# Function: createReactAutoPagesViteConfig()

> **createReactAutoPagesViteConfig**(`options?`): `UserConfig`

Create the shared Vite config for React SSR apps that use auto-discovered pages.

This extends [viteConfig](../variables/viteConfig.md) with a second SSR build environment so a plain
`vp build` emits both the client bundle and the React SSR `dist-server`
bundle. Use it when the app relies on `@faasjs/react/auto-pages` and should
not keep a local SSR build script.

## Parameters

### options?

[`ReactAutoPagesViteConfigOptions`](../type-aliases/ReactAutoPagesViteConfigOptions.md) = `{}`

Optional SSR build overrides.

## Returns

`UserConfig`

Vite config with both client and SSR builds configured.

## Example

```ts
import { defineConfig } from 'vite-plus'
import { createReactAutoPagesViteConfig } from '@faasjs/dev'

export default defineConfig(createReactAutoPagesViteConfig())
```
