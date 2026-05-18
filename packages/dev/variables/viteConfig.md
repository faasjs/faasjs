[@faasjs/dev](../README.md) / ViteConfig

# Variable: ViteConfig

> `const` **ViteConfig**: `object`

Shared Vite Plus configuration for standard FaasJS React apps.

This preset combines the React plugin, `viteFaasJsServer()`, workspace-safe
dev server defaults, `tsconfigPaths` resolution, and the shared FaasJS
format and lint settings. Spread it into `defineConfig()` when the default
stack matches your app, then override only the fields that differ.

## Type Declaration

### fmt

> **fmt**: `NonNullable`\<`UserConfig`\[`"fmt"`\]\>

### lint

> **lint**: `NonNullable`\<`UserConfig`\[`"lint"`\]\>

### plugins

> **plugins**: `NonNullable`\<`UserConfig`\[`"plugins"`\]\>

### resolve

> **resolve**: `NonNullable`\<`UserConfig`\[`"resolve"`\]\>

### server

> **server**: `NonNullable`\<`UserConfig`\[`"server"`\]\>

### staged

> **staged**: `NonNullable`\<`UserConfig`\[`"staged"`\]\>

## Examples

```ts
import { defineConfig } from 'vite-plus'
import { ViteConfig } from '@faasjs/dev'

export default defineConfig({
  ...ViteConfig,
})
```

```ts
import { defineConfig } from 'vite-plus'
import { ViteConfig } from '@faasjs/dev'

export default defineConfig({
  ...ViteConfig,
  test: {
    environment: 'jsdom',
  },
})
```
