[@faasjs/dev](../README.md) / ViteConfig

# Variable: ViteConfig

> `const` **ViteConfig**: `object`

Shared Vite Plus configuration for standard FaasJS React apps.

`ViteConfig` is intentionally named as a configuration object, not a plugin:
spread it into `defineConfig()` when you want the default FaasJS React development
stack. The preset combines staged checks, the React plugin, `viteFaasJsServer()`,
workspace-safe dev server defaults, `tsconfigPaths` resolution, and the shared
FaasJS format and lint settings. Override individual fields after spreading
the object when an app needs different defaults.

## Type Declaration

### fmt

> **fmt**: `NonNullable`\<`UserConfig`\[`"fmt"`\]\>

Applies the shared FaasJS Oxfmt defaults.

### lint

> **lint**: `NonNullable`\<`UserConfig`\[`"lint"`\]\>

Applies the shared FaasJS Oxlint defaults.

### plugins

> **plugins**: `NonNullable`\<`UserConfig`\[`"plugins"`\]\>

Registers React support and the in-process FaasJS POST server plugin.

### resolve

> **resolve**: `NonNullable`\<`UserConfig`\[`"resolve"`\]\>

Enables Vite Plus `tsconfigPaths` resolution.

### server

> **server**: `NonNullable`\<`UserConfig`\[`"server"`\]\>

Binds to all interfaces, allows port fallback, and disables strict filesystem serving.

### staged

> **staged**: `NonNullable`\<`UserConfig`\[`"staged"`\]\>

Runs `vp check --fix` for staged files.

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
