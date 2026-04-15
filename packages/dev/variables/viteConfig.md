[@faasjs/dev](../README.md) / viteConfig

# Variable: viteConfig

> `const` **viteConfig**: `object`

Shared Vite Plus configuration for standard FaasJS React apps.

This preset combines the React plugin, `viteFaasJsServer()`, workspace-safe
dev server defaults, `tsconfigPaths` resolution, the `virtual:faasjs-pages`
module used by `@faasjs/react/routing`, and the shared FaasJS format and
lint settings. Spread it into `defineConfig()` when the default stack
matches your app, then override only the fields that differ.

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
import { viteConfig } from '@faasjs/dev'

export default defineConfig({
  ...viteConfig,
})
```

```ts
import { defineConfig } from 'vite-plus'
import { viteConfig } from '@faasjs/dev'

export default defineConfig({
  ...viteConfig,
  test: {
    environment: 'jsdom',
  },
})
```
