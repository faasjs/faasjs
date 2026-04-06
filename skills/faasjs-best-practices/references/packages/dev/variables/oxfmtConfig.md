[@faasjs/dev](../README.md) / oxfmtConfig

# Variable: oxfmtConfig

> `const` **oxfmtConfig**: `NonNullable`\<`UserConfig`\[`"fmt"`\]\>

Shared Oxfmt configuration used by FaasJS projects.

## Example

```ts
import { defineConfig } from 'vite-plus'
import { oxfmtConfig } from '@faasjs/dev'

export default defineConfig({
  fmt: oxfmtConfig,
})
```
