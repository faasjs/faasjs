[@faasjs/dev](../README.md) / OxfmtConfig

# Variable: OxfmtConfig

> `const` **OxfmtConfig**: `NonNullable`\<`UserConfig`\[`"fmt"`\]\>

Shared Oxfmt configuration used by FaasJS projects.

## Example

```ts
import { defineConfig } from 'vite-plus'
import { OxfmtConfig } from '@faasjs/dev'

export default defineConfig({
  fmt: OxfmtConfig,
})
```
