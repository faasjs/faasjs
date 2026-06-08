[@faasjs/dev](../README.md) / OxfmtConfig

# Variable: OxfmtConfig

> `const` **OxfmtConfig**: `NonNullable`\<`UserConfig`\[`"fmt"`\]\>

Shared Oxfmt configuration used by FaasJS projects.

Enables single quotes, omits semicolons, and sorts import declarations.
These defaults match the FaasJS repository style and can be overridden
by spreading additional `fmt` options. Generated output under `dist/`,
`.faasjs/`, and `node_modules/` is ignored by default.

## Example

```ts
import { defineConfig } from 'vite-plus'
import { OxfmtConfig } from '@faasjs/dev'

export default defineConfig({
  fmt: OxfmtConfig,
})
```
